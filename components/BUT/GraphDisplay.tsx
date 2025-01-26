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
import { Select, MenuItem } from '@mui/material';
import { Typography } from "@mui/material";
import { MathJax, MathJaxContext } from 'better-react-mathjax';

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
  exportChart: () => void;
  loading: boolean;
}

const getCoeffSymbols = (count: number) => {
  return ["a", "b", "c", "d", "e"].slice(0, count);
};

const formatNumber = (num: number) => num.toFixed(4);

function renderEquationAndCoefficients(stats: any, selectedModel: string) {
  const model = stats?.results?.find((m: any) => m.type === selectedModel);
  console.log(model);
  // Gérer le cas d'erreur
  if(model?.error) {
    return (
      <div className="mb-4">
        <Typography color="error">
          {model.error}
        </Typography>
      </div>
    );
  }

  if(!model || !model.coefficients) return null;

  const coeffs = model.coefficients;
  const symbols = getCoeffSymbols(coeffs.length);
  let equation = "";

  switch(selectedModel) {
    case "linear":
      equation = `$y = ${symbols[0]} + ${symbols[1]}x$`;
      break;
    case "polynomial2":
      equation = `$y = ${symbols[0]} + ${symbols[1]}x + ${symbols[2]}x^2$`;
      break;
    case "polynomial3":
      equation = `$y = ${symbols[0]} + ${symbols[1]}x + ${symbols[2]}x^2 + ${symbols[3]}x^3$`;
      break;
    case "logarithmic10":
      equation = `$y = ${symbols[0]} + ${symbols[1]}\\log_{10}(x)$`;
      break;
    case "logarithmicE":
      equation = `$y = ${symbols[0]} + ${symbols[1]}\\ln(x)$`;
      break;
    case "exponential":
      equation = `$y = ${symbols[0]} e^{${symbols[1]}x}$`;
      break;
    case "power":
      equation = `$y = ${symbols[0]}x^{${symbols[1]}}$`;
      break;
    default:
      equation = "";
  }

  return (
    <div className="mb-4">
      <MathJaxContext config={configMathJax}>
      <Typography>
        <MathJax>{equation}</MathJax>
      </Typography>
      <table style={{ marginTop: "8px" }}>
        <tbody>
          {coeffs.map((coef: number, i: number) => (
            <tr key={i}>
              <td><MathJax>{`$${symbols[i]}$`}</MathJax></td>
              <td>{formatNumber(coef)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </MathJaxContext>
    </div>
  );
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


  return (
    <div ref={containerRef} className="w-full border rounded p-4 bg-white shadow-sm grid grid-cols-1 gap-4">
      {/* Model switch */}
      <div className="flex justify-center">
        <Select
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full md:w-auto"
        >
          <MenuItem value="linear">Régression linéaire</MenuItem>
          <MenuItem value="polynomial2">Polynomiale (2e degré)</MenuItem>
          <MenuItem value="polynomial3">Polynomiale (3e degré)</MenuItem>
          <MenuItem value="logarithmic10">Logarithmique (base 10)</MenuItem>
          <MenuItem value="logarithmicE">Logarithmique (base e)</MenuItem>
          <MenuItem value="exponential">Exponentielle</MenuItem>
        </Select>
      </div>

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
                data={generateChartData(selectedModel).points}
                fill="#8884d8"
              />
              {stats?.results && (
                <Scatter
                  name="Regression"
                  data={generateChartData(selectedModel).regressionLine}
                  fill="#d69404"
                  line
                  shape="cross"
                />
              )}
            </ScatterChart>
          )}
        </div>
      )}
      {renderEquationAndCoefficients(stats, selectedModel)}
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