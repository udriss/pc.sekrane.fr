import { NextRequest, NextResponse } from 'next/server';
import regression, { DataPoint } from 'regression';

interface RegressionResult {
  coefficients: number[];
  r2: number;
  error?: string;
}

function logarithmicBase10(data: Array<[number, number]>) {
  // On vérifie s'il y a au moins une valeur négative ou nulle
  const hasNegativeOrZero = data.some(([x]) => x <= 0);
  if (hasNegativeOrZero) {
    return {
      equation: [],
      points: [],
      string: 'y = a + b * log10(x)',
      r2: 0,
      type: 'logarithmic10',
      error: 'Impossible de calculer la régression logarithmique (base 10) : certaines valeurs sont négatives ou nulles',
    };
  }
  const transformed = data.map(([x, y]) => [Math.log10(x), y]);
  const res = regression.linear(transformed as DataPoint[]);
  return {
    equation: res.equation,
    points: res.points,
    string: 'y = a + b * log10(x)',
    r2: res.r2,
    type: 'logarithmic10'
  };
}

function logarithmicBaseE(data: Array<[number, number]>) {
  // On vérifie s'il y a au moins une valeur négative ou nulle
  const hasNegativeOrZero = data.some(([x]) => x <= 0);
  if (hasNegativeOrZero) {
    return {
      equation: [],
      r2: 0,
      type: 'logarithmicE',
      error: 'Impossible de calculer la régression logarithmique (base e) : certaines valeurs sont négatives ou nulles',
    };
  }
  return regression.logarithmic(data as DataPoint[]);
}

const regressionTypes = [
  { name: 'linear',       method: regression.linear },
  { name: 'polynomial2',  method: (data: any) => regression.polynomial(data, { order: 2 }) },
  { name: 'polynomial3',  method: (data: any) => regression.polynomial(data, { order: 3 }) },
  { name: 'logarithmic10',method: logarithmicBase10 },
  { name: 'logarithmicE', method: logarithmicBaseE },
  { name: 'exponential',  method: regression.exponential },
];

function standardizeResult(result: any): RegressionResult {
  return {
    coefficients: Array.isArray(result.equation) ? result.equation : [result.equation],
    r2: result.r2,
    ...(result.error && { error: result.error })
  };
}

export async function POST(req: NextRequest) {
  try {
    const { xValues, yValues } = await req.json();

    // Calcul de la moyenne
    const meanX = xValues.reduce((a: number, b: number) => a + b, 0) / xValues.length;
    const meanY = yValues.reduce((a: number, b: number) => a + b, 0) / xValues.length;

    // Calcul de la variance
    const varianceX = xValues.reduce((a: number, b: number) => a + Math.pow(b - meanX, 2), 0) / xValues.length;
    const varianceY = yValues.reduce((a: number, b: number) => a + Math.pow(b - meanY, 2), 0) / yValues.length;

    // Calcul de la covariance
    const covariance = xValues.reduce((a: number, i: number, idx: number) => {
      return a + (xValues[idx] - meanX) * (yValues[idx] - meanY);
    }, 0) / xValues.length;

    // Calcul du coefficient de corrélation
    const correlation = covariance / (Math.sqrt(varianceX) * Math.sqrt(varianceY));

    const errors: string[] = [];
    const points: DataPoint[] = xValues.map((x: number, i: number) => [x, yValues[i]]);

    const results = regressionTypes.map(regType => {
      const result = regType.method(points);
      return {
        type: regType.name,
        ...standardizeResult(result)
      };
    });

    console.log('results', results);

    return NextResponse.json({
      meanX,
      meanY,
      varianceX,
      varianceY,
      covariance,
      correlation,
      sampleSize: xValues.length,
      results,
      errors
    });
    

  } catch (error) {
    return NextResponse.json({ error: 'Error calculating statistics' }, { status: 500 });
  }
}

