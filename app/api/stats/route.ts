import { NextRequest } from 'next/server';
import * as regression from 'regression';
import { mean, variance, sampleCovariance, sampleCorrelation } from 'simple-statistics';

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

const regressionTypes = [
  { 
    name: 'linear',       
    method: (data: DataPoint[]) => {
      const precision = getPrecision(data);
      const result = regression.linear(data, { precision });
      return {
        ...result,
        equation: result.equation // [gradient, y-intercept]
      };
    }
  },
  { 
    name: 'polynomial2',  
    method: (data: DataPoint[]) => {
      if (data.length < 3) {
        throw new Error('Need at least 3 points for quadratic regression');
      }
      const precision = getPrecision(data);
      const result = regression.polynomial(data, { order: 2, precision });
      return {
        ...result,
        equation: result.equation // [a2, a1, a0]
      };
    }
  },
  { 
    name: 'polynomial3',  
    method: (data: DataPoint[]) => {
      if (data.length < 4) {
        throw new Error('Il faut au moins 4 points pour une régression cubique');
      }
      const precision = getPrecision(data);
      const result = regression.polynomial(data, { order: 3, precision });
      return {
        ...result,
        equation: result.equation // [a3, a2, a1, a0]
      };
    }
  },
  {
    name: 'logarithmicE',
    method: (data: DataPoint[]) => {
      if (data.some(point => point[0] <= 0)) {
        throw new Error('La régression logarithmique nécessite des valeurs x <strong>strictement</strong> positives');
      }
      const precision = getPrecision(data);
      const result = regression.logarithmic(data, { precision });
      return {
        ...result,
        equation: result.equation // [a, b]
      };
    }
  },
  {
    name: 'exponential',
    method: (data: DataPoint[]) => {
      if (data.some(point => point[1] <= 0)) {
        throw new Error('La régression exponentielle nécessite des valeurs y <strong>strictement</strong> positives');
      }
      const precision = getPrecision(data);
      const result = regression.exponential(data, { precision });
      return {
        ...result,
        equation: result.equation // [a, b]
      };
    }
  },
  {
    name: 'power',
    method: (data: DataPoint[]) => {
      if (data.some(point => point[0] <= 0 || point[1] <= 0)) {
        throw new Error('La régression puissance nécessite des valeurs x et y positives');
      }
      const precision = getPrecision(data);
      const result = regression.power(data, { precision });
      return {
        ...result,
        equation: result.equation // [a, b]
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
    coefficients: Array.isArray(result.equation) ? result.equation : [result.equation],
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