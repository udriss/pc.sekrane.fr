import React from 'react';
import { Typography, Paper, Select, MenuItem } from '@mui/material';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface ModelCoefficientsProps {
  selectedModel: string;
  stats: any;
  formatNumber: (num: number) => string;
  errors?: string[];
  setSelectedModel: (model: string) => void;
  submitData: () => void;
}

const configMathJax = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]]
  }
};

const getCoeffSymbols = (count: number) => {
  const symbols = ['α', 'β', 'γ', 'δ'];
  return symbols.slice(0, count);
};

export const ModelCoefficients = ({ selectedModel, stats, formatNumber, errors = [], setSelectedModel, submitData }: ModelCoefficientsProps) => {
  const renderEquationAndTable = () => {
    const model = stats.models.find((m: any) => m.type === selectedModel);
    if (!model || !model.result?.coefficients) {
      const apiError = errors.find(e => e.includes(model?.name));
      return (
        <Typography component="div" color="error">
          Erreur: Impossible de calculer la {model?.name}
          <Typography component="div" variant="body2" className="mt-2">{apiError}</Typography>
          {model?.result?.error && (
            <Typography component="div" variant="body2" className="mt-2">{model.result.error}</Typography>
          )}
        </Typography>
      );
    }

    const coefficients = model.result.coefficients;
    const symbols = getCoeffSymbols(coefficients.length);

    let equation;
    switch (selectedModel) {
      case 'linear':
        equation = `$y = ${symbols[0]} x + ${symbols[1]}$`;
        break;
      case 'polynomial2':
        equation = `$y = ${symbols[2]} x^2 + ${symbols[1]} x + ${symbols[0]}$`;
        break;
      case 'polynomial3':
        equation = `$y = ${symbols[3]} x^3 + ${symbols[2]} x^2 + ${symbols[1]} x + ${symbols[0]}$`;
        break;
      case 'logarithmic10':
        equation = `$y = ${symbols[1]} \\log_{10}(x) + ${symbols[0]}$`;
        break;
      case 'logarithmicE':
        equation = `$y = ${symbols[1]} \\ln(x) + ${symbols[0]}$`;
        break;
      case 'exponential':
        equation = `$y = ${symbols[0]} e^{${symbols[1]} x} + ${symbols[2]}$`;
        break;
      default:
        equation = '';
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Typography>
          <MathJax>{equation}</MathJax>
          <MathJax>{`$R^2 = ${formatNumber(model.result.rSquared)}$`}</MathJax>
        </Typography>
        <table className="min-w-full">
          <tbody>
            {coefficients.map((coef: number, index: number) => (
              <tr key={index}>
                <td><MathJax>{`$${symbols[index]}$`}</MathJax></td>
                <td>{formatNumber(coef)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <MathJaxContext config={configMathJax}>
      <Paper className="p-4 shadow-sm">
        <div className="w-full flex items-center justify-center">
          <Select
            value={selectedModel}
            onChange={(event) => {
              setSelectedModel(event.target.value);
              submitData();
            }}
            className="w-full md:w-auto"
          >
            <MenuItem value="linear">Régression linéaire</MenuItem>
            <MenuItem value="polynomial2">Régression polynomiale (2e degré)</MenuItem>
            <MenuItem value="polynomial3">Régression polynomiale (3e degré)</MenuItem>
            <MenuItem value="logarithmic10">Régression logarithmique (base 10)</MenuItem>
            <MenuItem value="logarithmicE">Régression logarithmique (base e)</MenuItem>
            <MenuItem value="exponential">Régression exponentielle</MenuItem>
          </Select>
        </div>
        {renderEquationAndTable()}
      </Paper>
    </MathJaxContext>
  );
};