import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { xValues, yValues } = await req.json();

    // Calcul de la moyenne
    const meanX = xValues.reduce((a: number, b: number) => a + b, 0) / xValues.length;
    const meanY = yValues.reduce((a: number, b: number) => a + b, 0) / yValues.length;

    // Calcul de la variance
    const varianceX = xValues.reduce((a: number, b: number) => a + Math.pow(b - meanX, 2), 0) / xValues.length;
    const varianceY = yValues.reduce((a: number, b: number) => a + Math.pow(b - meanY, 2), 0) / yValues.length;

    // Calcul de la covariance
    const covariance = xValues.reduce((a: number, i: number, idx: number) => {
      return a + (xValues[idx] - meanX) * (yValues[idx] - meanY);
    }, 0) / xValues.length;

    // Calcul du coefficient de corrélation
    const correlation = covariance / (Math.sqrt(varianceX) * Math.sqrt(varianceY));

    // Calcul de la régression linéaire
    const sumX = xValues.reduce((a: number, b: number) => a + b, 0);
    const sumY = yValues.reduce((a: number, b: number) => a + b, 0);
    const sumXY = xValues.reduce((a: number, x: number, i: number) => a + x * yValues[i], 0);
    const sumX2 = xValues.reduce((a: number, x: number) => a + x * x, 0);
    
    const n = xValues.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return NextResponse.json({
      meanX,
      meanY,
      varianceX,
      varianceY,
      covariance,
      correlation,
      sampleSize: xValues.length,
      regression: {
        slope,
        intercept
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Error calculating statistics' }, { status: 500 });
  }
}