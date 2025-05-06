import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

import { CircularProgress, Button, Grid } from "@mui/material";
import { RegressionModelSelector } from './RegressionModelSelector';
import TeX from '@matejmazur/react-katex';

import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div>Chargement du graphique ...</div>
});

interface ChartLabels {
  title: string;
  xLabel: string;
  yLabel: string;
}

const configMathJax = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]]
  }
};

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
  generateChartData: (model: string) => ChartData;
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

  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
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
    const rawData = generateChartData(selectedModel);
    
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
  }, [selectedModel, generateChartData]);

  return (
    <div ref={containerRef} className="w-full border rounded p-4 bg-white shadow-sm">
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <CircularProgress className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div ref={chartRef} className="export-container">
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
            <div className="export-details mt-6" style={{width: chartDimensions.width, fontSize: '0.85rem'}}>
              <RegressionModelSelector
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                stats={stats}
                formatNumber={formatNumber}
              />
            </div>
          )}
        </div>
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
    </div>
  );
};