import { NextRequest } from 'next/server';
import { mean, variance, sampleCovariance, sampleCorrelation } from 'simple-statistics';
import { SimpleLinearRegression, PolynomialRegression, ExponentialRegression, PowerRegression } from 'ml-regression';

type DataPoint = [number, number];

interface RegressionResult {
  coefficients: number[];
  r2: number;
  error?: string;
}

function getPrecision(data: DataPoint[]): number {
  const minValue = Math.min(...data.flat().map(Math.abs));
  if (minValue === 0) return 2;
  const decimalPlaces = -Math.floor(Math.log10(minValue)) + 1;
  return decimalPlaces > 2 ? decimalPlaces : 2;
}

function to4SignificantDigits(num: number): number {
  if (num === 0) return 0;
  return parseFloat(num.toPrecision(4));
}

function logRegression(x: number[], y: number[], base: 'e' | '10' = 'e') {
  // y = a + b * log(x) (base e ou base 10)
  const n = x.length;
  const logFn = base === 'e' ? Math.log : Math.log10;
  const X = x.map(xi => logFn(xi));
  const sumX = X.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXX = X.reduce((a, b) => a + b * b, 0);
  const sumXY = X.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) throw new Error('Données non adaptées à une régression logarithmique');
  const b = (n * sumXY - sumX * sumY) / denominator;
  const a = (sumY - b * sumX) / n;
  // Calcul du R²
  const yHat = X.map(xi => a + b * xi);
  const yMean = sumY / n;
  const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
  const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - yHat[i], 2), 0);
  const r2 = 1 - ssRes / ssTot;
  return {
    coefficients: [to4SignificantDigits(a), to4SignificantDigits(b)],
    r2
  };
}

const regressionTypes = [
  {
    name: 'linear',
    method: (data: DataPoint[]) => {
      const X = data.map(d => d[0]);
      const Y = data.map(d => d[1]);
      const reg = new SimpleLinearRegression(X, Y);
      return {
        coefficients: [to4SignificantDigits(reg.slope), to4SignificantDigits(reg.intercept)],
        r2: reg.score(X, Y)
      };
    }
  },
  {
    name: 'polynomial2',
    method: (data: DataPoint[]) => {
      if (data.length < 3) throw new Error('Need at least 3 points for quadratic regression');
      const X = data.map(d => d[0]);
      const Y = data.map(d => d[1]);
      const reg = new PolynomialRegression(X, Y, 2);
      return {
        coefficients: reg.coefficients.map(to4SignificantDigits),
        r2: reg.score(X, Y)
      };
    }
  },
  {
    name: 'polynomial3',
    method: (data: DataPoint[]) => {
      if (data.length < 4) throw new Error('Il faut au moins 4 points pour une régression cubique');
      const X = data.map(d => d[0]);
      const Y = data.map(d => d[1]);
      const reg = new PolynomialRegression(X, Y, 3);
      return {
        coefficients: reg.coefficients.map(to4SignificantDigits),
        r2: reg.score(X, Y)
      };
    }
  },
  {
    name: 'logarithmicE',
    method: (data: DataPoint[]) => {
      if (data.some(point => point[0] <= 0)) throw new Error('La régression logarithmique nécessite des valeurs x strictement positives');
      const X = data.map(d => d[0]);
      const Y = data.map(d => d[1]);
      return logRegression(X, Y, 'e');
    }
  },
  {
    name: 'logarithmic10',
    method: (data: DataPoint[]) => {
      if (data.some(point => point[0] <= 0)) throw new Error('La régression logarithmique nécessite des valeurs x strictement positives');
      const X = data.map(d => d[0]);
      const Y = data.map(d => d[1]);
      return logRegression(X, Y, '10');
    }
  },
  {
    name: 'exponential',
    method: (data: DataPoint[]) => {
      if (data.some(point => point[1] <= 0)) throw new Error('La régression exponentielle nécessite des valeurs y strictement positives');
      const X = data.map(d => d[0]);
      const Y = data.map(d => d[1]);
      const reg = new ExponentialRegression(X, Y);
      return {
        coefficients: [to4SignificantDigits(reg.A), to4SignificantDigits(reg.B)],
        r2: reg.score(X, Y)
      };
    }
  },
  {
    name: 'power',
    method: (data: DataPoint[]) => {
      if (data.some(point => point[0] <= 0 || point[1] <= 0)) throw new Error('La régression puissance nécessite des valeurs x et y positives');
      const X = data.map(d => d[0]);
      const Y = data.map(d => d[1]);
      const reg = new PowerRegression(X, Y);
      return {
        coefficients: [to4SignificantDigits(reg.A), to4SignificantDigits(reg.B)],
        r2: reg.score(X, Y)
      };
    }
  }
];

function standardizeResult(result: any): RegressionResult {
  if (result.error) {
    return {
      coefficients: [],
      r2: 0,
      error: result.error
    };
  }
  return {
    coefficients: result.coefficients,
    r2: result.r2 || 0
  };
}

export async function POST(req: NextRequest) {
  try {
    const { xValues, yValues } = await req.json();
    const data = xValues.map((x: number, i: number) => [x, yValues[i]]) as DataPoint[];
    
    const meanX = mean(xValues);
    const meanY = mean(yValues);
    const varianceX = variance(xValues);
    const varianceY = variance(yValues);
    const covariance = sampleCovariance(xValues, yValues);
    const correlation = sampleCorrelation(xValues, yValues);

    const results = regressionTypes.map(({ name, method }) => {
      try {
        const result = method(data);
        return { 
          type: name, 
          ...standardizeResult(result),
          error: null 
        };
      } catch (error) {
        return { 
          type: name, 
          coefficients: [], 
          r2: 0, 
          error: (error as Error).message 
        };
      }
    });

    return new Response(JSON.stringify({
      meanX,
      meanY, 
      varianceX,
      varianceY,
      covariance,
      correlation,
      sampleSize: xValues.length,
      results,
      errors: results.filter(r => r.error).map(r => ({
        type: r.type,
        message: r.error
      }))
    }), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}