import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

import { 
  CircularProgress, 
  Button, 
  Grid, 
  Box, 
  Paper, 
  Typography 
} from "@mui/material";
import { RegressionModelSelector } from './RegressionModelSelector';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <Box display="flex" justifyContent="center" alignItems="center" height={200}>
    <Typography>Chargement du graphique ...</Typography>
  </Box>
});

interface ChartLabels {
  title: string;
  xLabel: string;
  yLabel: string;
}



interface ChartDimensions {
  width: number;
  height: number;
}

interface ChartData {
  points: { x: number; y: number }[];
  regressionLine: { x: number; y: number }[];
}

interface GraphDisplayProps {
  chartLabels: ChartLabels;
  chartDimensions: ChartDimensions;
  generateChartData: (model: string, leftExt?: number, rightExt?: number) => ChartData;
  stats: {
    results: Array<{
      type: string;
      coefficients: number[];
      error?: string;
    }>;
  };
  isMobile: boolean;
  isClient: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  formatNumber: (num: number) => string;
}

export const GraphDisplay: React.FC<GraphDisplayProps> = ({
  chartLabels,
  chartDimensions,
  generateChartData,
  stats,
  isMobile,
  isClient,
  containerRef,
  chartRef,
  formatNumber,
  loading
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPlotly, setIsExportingPlotly] = useState(false);
  const [selectedModel, setSelectedModel] = useState("linear");
  const [showExportDetails, setShowExportDetails] = useState(false);
  const [leftExtension, setLeftExtension] = useState(0.2);
  const [rightExtension, setRightExtension] = useState(0.2);

  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };

  const handleExtendLeft = () => {
    setLeftExtension(prev => prev + 0.2);
  };

  const handleExtendRight = () => {
    setRightExtension(prev => prev + 0.2);
  };

  const handleResetExtensions = () => {
    setLeftExtension(0.2);
    setRightExtension(0.2);
  };



  const handleExportPlotly = async () => {
    setIsExportingPlotly(true);
    try {
      const gd = document.querySelector('.js-plotly-plot') as HTMLElement;
      if (gd && window.Plotly && window.Plotly.downloadImage) {
        await window.Plotly.downloadImage(gd, {
          format: 'png',
          filename: 'BUT_optique_graph_export',
          width: Math.max(chartDimensions.width, 600),
          height: Math.max(chartDimensions.height, 600),
        });
      } else {
        alert('Export Plotly non supporté dans ce contexte.');
      }
    } catch (e) {
      alert('Erreur export Plotly : ' + e);
    } finally {
      setIsExportingPlotly(false);
    }
  };

  const handleExportFull = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    setShowExportDetails(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      // 1. Récupère le graphDiv Plotly
      const gd = document.querySelector('.js-plotly-plot');
      if (!gd) throw new Error('Graphique Plotly non trouvé');
      // 2. Génère le PNG Plotly (rendu natif, haute qualité)
      const plotlyDataUrl = await window.Plotly.toImage(gd as HTMLElement, {
        format: 'png',
        width: Math.max(chartDimensions.width, 600),
        height: Math.max(chartDimensions.height, 600),
      });
      // 3. Génère le PNG de l'équation/tableau
      const exportContainer = chartRef.current.querySelector('.export-container') || chartRef.current;
      const details = exportContainer.querySelector('.export-details');
      if (!details) throw new Error('Bloc équation/tableau manquant');
      const detailsEl = details as HTMLElement;
      // Réduit la taille de l'équation et du tableau pour l'export
      // detailsEl.style.transform = 'scale(0.8)';
      detailsEl.style.transformOrigin = 'top center';
      const detailsCanvas = await html2canvas(detailsEl, { backgroundColor: null, scale: 2 });
      detailsEl.style.transform = '';
      detailsEl.style.transformOrigin = '';
      // 4. Assemble les deux images sur un canvas final (graph centré)
      const plotImg = new window.Image();
      plotImg.src = plotlyDataUrl;
      await new Promise(res => { plotImg.onload = res; });
      const eqHeight = detailsCanvas.height;
      const eqWidth = Math.max(plotImg.width, detailsCanvas.width);
      const margin = 32;
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = eqWidth;
      finalCanvas.height = plotImg.height + eqHeight + margin;
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context manquant');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      // Centre le graphique
      const plotX = (eqWidth - plotImg.width) / 2;
      ctx.drawImage(plotImg, plotX, 0, plotImg.width, plotImg.height);
      // Centre l'équation/tableau
      const detailsX = (eqWidth - detailsCanvas.width) / 2;
      ctx.drawImage(detailsCanvas, detailsX, plotImg.height + margin);
      // 5. Télécharge le PNG final
      const pngData = finalCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngData;
      link.download = 'regression-graph-complet.png';
      link.click();
    } catch (error) {
      alert('Erreur export PNG : ' + error);
    } finally {
      setShowExportDetails(false);
      setIsExporting(false);
    }
  };

  const chartData = React.useMemo(() => {
    const rawData = generateChartData(selectedModel, leftExtension, rightExtension);
    
    // Only filter out null points, keep (0,0) if it's a valid data point
    const validPoints = rawData.points.filter(point => 
      point !== null && point !== undefined
    );

    // Only generate regression line if we have valid points
    const regressionLine = validPoints.length >= 2 ? 
      rawData.regressionLine : [];

    return {
      points: validPoints,
      regressionLine
    };
  }, [selectedModel, leftExtension, rightExtension, generateChartData]);

  return (
    <Paper 
      ref={containerRef} 
      elevation={1}
      sx={{ 
        width: '100%', 
        borderRadius: 2, 
        p: 3, 
        bgcolor: 'background.paper' 
      }}
    >
      {loading ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height={400}
        >
          <CircularProgress size={32} color="primary" />
        </Box>
      ) : (
        <Box ref={chartRef} className="export-container">
          {isClient && chartDimensions.width > 0 && (
            <Plot
              data={[
                {
                  x: chartData.points.map(p => p.x),
                  y: chartData.points.map(p => p.y),
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Points'
                },
                {
                  x: chartData.regressionLine.map(p => p.x),
                  y: chartData.regressionLine.map(p => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Regression'
                }
              ]}
              layout={{
                width: chartDimensions.width,
                height: Math.max(chartDimensions.height, 400),
                title: {
                  text: chartLabels.title,
                  font: {
                    family: 'Computer Modern Serif',
                    size: 18,
                    weight: 700
                  }
                },
                xaxis: { 
                  title: {
                    text: chartLabels.xLabel,
                    font: {
                      family: 'Computer Modern Serif',
                      size: 14
                    }
                  }
                },
                yaxis: { 
                  title: {
                    text: chartLabels.yLabel,
                    font: {
                      family: 'Computer Modern Serif',
                      size: 14
                    }
                  }
                },
                legend: {
                  orientation: 'h',
                  x: 0.5,
                  y: -0.25, // Place la légende sous le graphique
                  xanchor: 'center',
                  yanchor: 'top',
                  font: {
                    family: 'Computer Modern Serif',
                    size: 12
                  }
                },
                margin: {
                  t: 100, // Marge supérieure augmentée pour le titre
                  b: 80,  // Marge inférieure augmentée pour la légende
                  l: 50,
                  r: 50
                }
              }}
              config={{
                displayModeBar: true,
                displaylogo: false,
                scrollZoom: true,
                toImageButtonOptions: {
                  format: 'png',
                  filename: 'BUT_optique_graph_export',
                  width: chartDimensions.width,
                  height: Math.max(chartDimensions.height, 400)
                  // scale: 4 // supprimé car non supporté
                },
                modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                responsive: true,
              }}
            />
          )}
          {/* Affichage de l'équation et du tableau pour l'export PNG (visible uniquement pendant l'export) */}
          {showExportDetails && (
            <Box 
              className="export-details" 
              sx={{ 
                mt: 3, 
                width: chartDimensions.width, 
                fontSize: '0.85rem' 
              }}
            >
              <RegressionModelSelector
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                stats={stats}
                formatNumber={formatNumber}
              />
            </Box>
          )}
        </Box>
      )}
      {/* Affichage du tableau/équation principal uniquement hors export */}
      {!showExportDetails && (
        <RegressionModelSelector 
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          stats={stats}
          formatNumber={formatNumber}
        />
      )}

      <Grid container
      sx={{
        mt: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
      >
        <Grid size={{ xs:12, sm:12, md:12, lg:12 }} key="export-plotly">
          <Button
            onClick={handleExportPlotly}
            variant="outlined"
            color="secondary"
            startIcon={isExportingPlotly ? <CircularProgress size={18} color="inherit" /> : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-12m0 12l-4-4m4 4l4-4M4.5 20.25h15" />
              </svg>
            )}
            disabled={isExportingPlotly}
            fullWidth
          >
            {isExportingPlotly ? 'En cours...' : 'Exporter graph'}
          </Button>
        </Grid>
        <Grid size={{ xs:12, sm:12, md:12, lg:12 }} key="export-full">
          <Button
            onClick={handleExportFull}
            variant="outlined"
            color="success"
            startIcon={isExporting ? <CircularProgress size={18} color="inherit" /> : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-12m0 12l-4-4m4 4l4-4M4.5 20.25h15" />
              </svg>
            )}
            disabled={isExporting}
            fullWidth
          >
            {isExporting ? 'En cours...' : 'Exporter graph + équation'}
          </Button>
        </Grid>
      </Grid>
            {/* Contrôles d'extension de la droite de régression */}
      {selectedModel === "linear" && (
        <Paper 
          elevation={0}
          sx={{ 
            mt: 2, 
            p: 2, 
            border: 1, 
            borderColor: 'grey.300', 
            borderRadius: 1, 
            bgcolor: 'grey.50' 
          }}
        >
          <Typography 
            variant="subtitle2" 
            component="h3" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'medium' }}
          >
            Prolongement de la droite de régression
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs:6, sm:6, md:6 }} key="extend-left">
              <Button
                onClick={handleExtendLeft}
                variant="outlined"
                color="primary"
                size="small"
                startIcon={
                 <ArrowBackIcon />
                }
                fullWidth
              >
                Étendre à gauche
              </Button>
            </Grid>
            <Grid size={{ xs:6, sm:6, md:6 }} key="extend-right">
              <Button
                onClick={handleExtendRight}
                variant="outlined"
                color="primary"
                size="small"
                endIcon={
                  <ArrowForwardIcon />
                }
                fullWidth
              >
                Étendre à droite
              </Button>
            </Grid>
            <Grid size={{ xs:12, sm:12, md:12 }} key="reset-extensions">
              <Button
                onClick={handleResetExtensions}
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                }
                fullWidth
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
          <Typography 
            variant="caption" 
            align="center" 
            display="block" 
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            Extension: {Math.round(leftExtension * 100)}% à gauche, {Math.round(rightExtension * 100)}% à droite
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};