"use client";

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import html2canvas from 'html2canvas';
import { useMediaQuery } from '@mui/material';
import Cookies from 'js-cookie';

import { StatsTable } from '@/components/BUT/StatsTable';
import { GraphDisplay } from '@/components/BUT/GraphDisplay';
import { StatsInfo } from '@/components/BUT/StatsInfo';

import {
  TextField,
  Alert,
  Snackbar,
  InputAdornment
} from '@mui/material';
import {
  Title,
  Label,
  Numbers,
  DataArray,
  Science,
  BarChart
} from '@mui/icons-material';
import { Button } from "@/components/ui/button";
import { MathInput } from "@/components/BUT/MathInput";

// Dynamic import for Chart component
const DynamicChart = dynamic(() => import('recharts').then((mod) => mod.ScatterChart), {
  ssr: false,
});

// Update cookie functions
const saveToCookies = (xExpr: string[], yExpr: string[], xVals: number[], yVals: number[]) => {
  Cookies.set('regressionData', JSON.stringify({
    xExpressions: xExpr,
    yExpressions: yExpr,
    xValues: xVals,
    yValues: yVals
  }), { expires: 7 });
};

const loadFromCookies = () => {
  const savedData = Cookies.get('regressionData');
  if (savedData) {
    try {
      const { xExpressions, yExpressions, xValues, yValues } = JSON.parse(savedData);
      return { xExpressions, yExpressions, xValues, yValues };
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Update initial state
export default function StatisticsPage() {
  const [xExpressions, setXExpressions] = useState<string[]>(['']);
  const [yExpressions, setYExpressions] = useState<string[]>(['']);
  const [xValues, setXValues] = useState<number[]>([0]);
  const [yValues, setYValues] = useState<number[]>([0]);
  const [stats, setStats] = useState<any>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartLabels, setChartLabels] = useState({
    title: "Régression linéaire",
    xLabel: "X",
    yLabel: "Y"
  });

  // Add alert state
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    show: false,
    message: '',
    severity: 'info'
  });

  // Add loading state
  const [loading, setLoading] = useState(false);

  // Add new state and ref
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 100, height: 100 });
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Add client-side only state
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Then, handle dimensions
  useEffect(() => {
    if (!isClient || !stats) return;
  
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const width = containerWidth * 0.9;
        const height = width * 0.6;
        setChartDimensions({ width, height });
      }
    };
  
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef, isClient, stats, isMobile]);

  // Update useEffect for loading cookies
  useEffect(() => {
    const savedData = loadFromCookies();
    if (savedData?.xExpressions?.length && savedData?.yExpressions?.length) {
      setXExpressions(savedData.xExpressions);
      setYExpressions(savedData.yExpressions);
      setXValues(savedData.xValues || Array(savedData.xExpressions.length).fill(0));
      setYValues(savedData.yValues || Array(savedData.yExpressions.length).fill(0));
    }
  }, []);


  // Update addInputBoth
  const addInputBoth = () => {
    const newXExpr = [...xExpressions, ''];
    const newYExpr = [...yExpressions, ''];
    const newXVals = [...xValues, 0];
    const newYVals = [...yValues, 0];
    
    setXExpressions(newXExpr);
    setYExpressions(newYExpr);
    setXValues(newXVals);
    setYValues(newYVals);
    
    saveToCookies(newXExpr, newYExpr, newXVals, newYVals);
  };

  // Update removeInputBoth
  const removeInputBoth = () => {
    if (xExpressions.length > 1 && yExpressions.length > 1) {
      const newXExpr = xExpressions.slice(0, -1);
      const newYExpr = yExpressions.slice(0, -1);
      const newXVals = xValues.slice(0, -1);
      const newYVals = yValues.slice(0, -1);
      
      setXExpressions(newXExpr);
      setYExpressions(newYExpr);
      setXValues(newXVals);
      setYValues(newYVals);
      
      saveToCookies(newXExpr, newYExpr, newXVals, newYVals);
    }
  };



  const handleExpressionChange = (column: 'x' | 'y', index: number, expression: string, evaluated: number) => {
    if (column === 'x') {
      const newExpressions = [...xExpressions];
      const newValues = [...xValues];
      newExpressions[index] = expression;
      newValues[index] = evaluated;
      setXExpressions(newExpressions);
      setXValues(newValues);
      saveToCookies(newExpressions, yExpressions, newValues, yValues);
    } else {
      const newExpressions = [...yExpressions];
      const newValues = [...yValues];
      newExpressions[index] = expression;
      newValues[index] = evaluated;
      setYExpressions(newExpressions);
      setYValues(newValues);
      saveToCookies(xExpressions, newExpressions, xValues, newValues);
    }
  };

  const handleLabelChange = (key: 'title' | 'xLabel' | 'yLabel', value: string) => {
    setChartLabels(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update submitData function
const submitData = async () => {
  try {
    // Filter out empty expressions
    const validXValues = xExpressions.reduce((acc: number[], expr, index) => {
      if (expr.trim() !== '') {
        acc.push(xValues[index]);
      }
      return acc;
    }, []);

    const validYValues = yExpressions.reduce((acc: number[], expr, index) => {
      if (expr.trim() !== '') {
        acc.push(yValues[index]);
      }
      return acc;
    }, []);

    if (validXValues.length < 2 || validYValues.length < 2) {
      setAlert({
        show: true,
        message: 'Il faut au moins 2 points non vides pour faire une régression',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    const response = await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        xValues: validXValues, 
        yValues: validYValues 
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors du calcul');
    }

    setStats(data);
    setAlert({
      show: true,
      message: 'Calculs effectués avec succès',
      severity: 'success'
    });
  } catch (error) {
    setAlert({
      show: true,
      message: error instanceof Error ? error.message : 'Erreur lors du calcul',
      severity: 'error'
    });
  } finally {
    setLoading(false);
  }
};

  interface RegressionResult {
    type: string;
    coefficients: number[];
    r2: number;
  }
  
  interface Stats {
    results: RegressionResult[];
  }
  
  interface Point {
    x: number;
    y: number;
  }
  
  interface ChartData {
    points: Point[];
    regressionLine: Point[];
  }
  
  function generateChartData(stats: Stats | null, model: string): ChartData {
    // Create points only from non-empty expressions
    const points = xExpressions
      .map((expr, i) => {
        if (expr.trim() === '' || yExpressions[i].trim() === '') {
          return null;
        }
        return { x: xValues[i], y: yValues[i] };
      })
      .filter((point): point is Point => point !== null);

    const selectedReg = stats?.results?.find(r => r.type === model);

    if (!points.length || !selectedReg) {
      return { points, regressionLine: [] };
    }

    // Calculate x range from valid points only
    const xMin = Math.min(...points.map(p => p.x));
    const xMax = Math.max(...points.map(p => p.x));

    const xDepart = xMin - (xMax - xMin) * 0.2;
    const xArrive = xMax + (xMax - xMin) * 0.2;
    // Generate regression line
    const regressionLine: Point[] = [];
    const numPoints = 250;
    const step = (xArrive - xDepart) / numPoints;
  
    for (let i = 0; i <= numPoints; i++) {
      const x = xDepart + (i * step);
      let y = 0;
  
      try {
        switch (model) {
          case 'linear':
            y = selectedReg.coefficients[0] * x + selectedReg.coefficients[1];
            break;
          case 'polynomial2':
            y = selectedReg.coefficients[0] * Math.pow(x, 2) + 
                selectedReg.coefficients[1] * x + 
                selectedReg.coefficients[2];
            break;
          case 'polynomial3':
            y = selectedReg.coefficients[0] * Math.pow(x, 3) + 
                selectedReg.coefficients[1] * Math.pow(x, 2) + 
                selectedReg.coefficients[2] * x + 
                selectedReg.coefficients[3];
            break;
          case 'logarithmicE':
            if (x > 0) {
              y = selectedReg.coefficients[0] + selectedReg.coefficients[1] * Math.log(x);
            } else {y=NaN}
            break;
          case 'exponential':
            y = selectedReg.coefficients[0] * Math.exp(selectedReg.coefficients[1] * x);
            break;
          case 'power':
            if (x > 0) {
              y = selectedReg.coefficients[0] * Math.pow(x, selectedReg.coefficients[1]);
            }
            break;
        }
  
        if (isFinite(y) && !isNaN(y)) {
          regressionLine.push({ x, y });
        }
      } catch (error) {
        console.error('Error calculating regression point:', error);
        continue;
      }
    }

    return { points, regressionLine };
  }



  // Clear all data
const clearData = () => {
  setXValues([0]);
  setYValues([0]);
  setStats(null);
  Cookies.remove('regressionData');
  setAlert({
    show: true,
    message: 'Toutes les données ont été supprimées',
    severity: 'info'
  });
};

  // Update precision calculation function
  const calculatePrecision = (num: number): number => {
    // Handle special cases
    if (num === 0) return 2;
    
    // Get magnitude using log10
    const magnitude = Math.floor(Math.log10(Math.abs(num)));
    
    // Adjust precision based on magnitude
    if (magnitude >= 4) {
      return 2; // For large numbers (≥10000), show 2 decimals
    } else if (magnitude <= -4) {
      return Math.abs(magnitude) + 2; // For very small numbers, increase precision
    } else {
      return 5; // Default precision for normal range numbers
    }
  };
  
  // Update format number to use new precision calculation
  function formatNumber(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
  
    const strValue = value.toString();
  
    // Scientific notation case
    if (strValue.includes('e') || strValue.includes('E')) {
      const [base, exponent] = strValue.split(/[eE]/);
      const roundedBase = Number(base).toFixed(4);
      return `${roundedBase} \\cdot 10^{${exponent}}`;
    }
  
    // Regular number case
    const precision = calculatePrecision(value);
    return Number(value).toFixed(precision);
  }

  // Update render with null checks
  return (
    <div className="w-full max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Colonne X */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4 w-full text-center">Colonne X</h2>
          <div className="space-y-2">
            {(xExpressions || ['']).map((expr, index) => (
              <MathInput
                key={index}
                value={expr}
                onChange={(expr, evaluated) => handleExpressionChange('x', index, expr, evaluated ?? 0)}
              />
            ))}
          </div>
        </div>

        {/* Colonne Y */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4 w-full text-center">Colonne Y</h2>
          <div className="space-y-2">
            {(yExpressions || ['']).map((expr, index) => (
              <MathInput
                key={index}
                value={expr}
                onChange={(expr, evaluated) => handleExpressionChange('y', index, expr, evaluated ?? 0)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 w-full">
      <Button onClick={addInputBoth} 
              className="w-full md:w-48 border-2 border-gray-500 text-gray-600 hover:bg-gray-100 hover:border-gray-600"
              variant="outline">
                Ajouter ligne
            </Button>
            <Button onClick={submitData}
              className="w-full md:w-48 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
              variant="outline"
            >
                Calculer les statistiques
            </Button>
            <Button 
              onClick={removeInputBoth} 
              className="w-full md:w-32 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
              variant="outline"
            >
              Supprimer ligne
            </Button>
            <Button 
              onClick={clearData}
              variant="destructive"
              className="flex items-center gap-2"
            >
              Supprimer toutes les données
            </Button>
        </div>

      {stats && (
        <div className="mt-8">
          {/* Labels inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <TextField
              label="Titre du graphique"
              value={chartLabels.title}
              onChange={(e) => handleLabelChange('title', e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Title />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <TextField
              label="Label axe X"
              value={chartLabels.xLabel}
              onChange={(e) => handleLabelChange('xLabel', e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Label />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <TextField
              label="Label axe Y"
              value={chartLabels.yLabel}
              onChange={(e) => handleLabelChange('yLabel', e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Label />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </div>
        </div>
      )}

{stats && (
<div className="mt-8">
<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GraphDisplay
    chartLabels={chartLabels}
    chartDimensions={chartDimensions}
    generateChartData={(model: string) => generateChartData(stats, model)}
    stats={stats}
    isMobile={isMobile}
    isClient={isClient}
    containerRef={containerRef}
    chartRef={chartRef}
    formatNumber={formatNumber}
    loading={loading}
  />
  <StatsTable stats={stats} formatNumber={formatNumber} />
    </div>
    <div className="w-full grid grid-cols-1 lg:grid-cols-1 gap-8">
      <StatsInfo />
      </div>
</div>

)}



      {/* Alert System */}
      <Snackbar 
        open={alert.show} 
        autoHideDuration={6000} 
        onClose={() => setAlert({...alert, show: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={alert.severity} 
          onClose={() => setAlert({...alert, show: false})}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}