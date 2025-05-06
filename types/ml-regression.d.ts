declare module 'ml-regression' {
  export class SimpleLinearRegression {
    constructor(x: number[], y: number[]);
    slope: number;
    intercept: number;
    score(x: number[], y: number[]): number;
    predict(x: number | number[]): number | number[];
  }

  export class PolynomialRegression {
    constructor(x: number[], y: number[], degree: number);
    coefficients: number[];
    score(x: number[], y: number[]): number;
    predict(x: number | number[]): number | number[];
  }

  export class ExponentialRegression {
    constructor(x: number[], y: number[]);
    A: number;
    B: number;
    score(x: number[], y: number[]): number;
    predict(x: number | number[]): number | number[];
  }

  export class PowerRegression {
    constructor(x: number[], y: number[]);
    A: number;
    B: number;
    score(x: number[], y: number[]): number;
    predict(x: number | number[]): number | number[];
  }

  export class LogarithmicRegression {
    constructor(x: number[], y: number[]);
    A: number;
    B: number;
    score(x: number[], y: number[]): number;
    predict(x: number | number[]): number | number[];
  }
}
