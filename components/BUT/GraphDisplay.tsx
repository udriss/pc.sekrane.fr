import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  generateChartData: () => ChartData;
  stats: any;
  isMobile: boolean;
  isClient: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.RefObject<HTMLDivElement | null>;
  exportChart: () => void;
  loading: boolean;
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
  exportChart,
  loading
}) => {
  const [isExporting, setIsExporting] = useState(false);

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

  return (
    <div ref={containerRef} className="w-full border rounded p-4 bg-white shadow-sm grid grid-cols-1 gap-4">
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div ref={chartRef}>
          <h3 className="text-center font-bold mb-4">{chartLabels.title}</h3>
          {isClient && chartDimensions.width > 0 && (
            <ScatterChart
              width={chartDimensions.width}
              height={chartDimensions.height}
              margin={{ 
                top: 20, 
                right: isMobile ? 10 : 20, 
                bottom: isMobile ? 50 : 30, 
                left: isMobile ? 40 : 40 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="X" 
                label={{ 
                  value: chartLabels.xLabel, 
                  position: 'bottom' 
                }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Y"
                label={{ 
                  value: chartLabels.yLabel, 
                  angle: -90, 
                  position: 'left' 
                }}
              />
              <Tooltip />
              <Scatter 
                name="Points" 
                data={generateChartData().points} 
                fill="#8884d8" 
              />
              {stats?.regression && (
                <Scatter 
                  name="Points" 
                  data={generateChartData().regressionLine} 
                  fill="#d69404" 
                  line 
                  shape="cross" 
                />
              )}
            </ScatterChart>
          )}
        </div>
      )}
      <div className="flex justify-center">
        <Button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? 'Export en cours...' : 'Exporter en PNG'}
        </Button>
      </div>
    </div>
  );
};