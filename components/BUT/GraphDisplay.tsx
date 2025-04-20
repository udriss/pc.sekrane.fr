import React, { useState } from 'react';

import { CircularProgress } from "@mui/material";
import { RegressionModelSelector } from './RegressionModelSelector';

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
  const [selectedModel, setSelectedModel] = useState("linear");


  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };

  const handleExport = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    
    try {
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) return;

      const canvas = document.createElement('canvas');
      const scale = 2;
      const { width, height } = svgElement.getBoundingClientRect();
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngData = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = pngData;
      link.download = 'regression-chart.png';
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
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
        <div ref={chartRef}>
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
                  y: 1.1,
                  xanchor: 'center',
                  yanchor: 'top',
                  font: {
                    family: 'Computer Modern Serif',
                    size: 12
                  }
                },
                margin: {
                  t: 80, // Increased top margin for title and legend
                  b: 50,
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
                  height: Math.max(chartDimensions.height, 400),
                  scale: 4  // Increased scale factor for better quality
                },
                modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                responsive: true,
              }}
            />
          )}
        </div>
      )}
      <RegressionModelSelector 
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        stats={stats}
        formatNumber={formatNumber}
      />
      {/* <div className="flex justify-center">
        <Button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isExporting ? (
            <CircularProgress className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? 'Export en cours...' : 'Exporter en PNG'}
        </Button>
      </div> */}
    </div>
  );
};