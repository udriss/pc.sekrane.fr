import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import { Select, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

interface RegressionModelSelectorProps {
  selectedModel: string;
  onModelChange: (event: any) => void;
  stats: any;
  formatNumber?: (num: number) => string;
}


const getCoeffSymbols = (count: number) => {
  return ["a", "b", "c", "d", "e"].slice(0, count);
};

// Helper pour afficher un coefficient avec son signe (pour l'affichage d'équation)
function formatSignedNumber(num: number, formatNumber: (n: number) => string) {
  if (num < 0) return `- ${formatNumber(Math.abs(num))}`;
  return `+ ${formatNumber(num)}`;
}

function renderEquationAndCoefficients(stats: any, selectedModel: string, formatNumber: (num: number) => string) {
  const model = stats?.results?.find((m: any) => m.type === selectedModel);

  if(model?.error) {
    return (
      <div className="mb-4">
        <Typography 
          color="error" 
          dangerouslySetInnerHTML={{ __html: model.error }}
        />
      </div>
    );
  }

  if(!model || !model.coefficients) return null;
  const coeffs = model.coefficients;
  const symbols = getCoeffSymbols(coeffs.length);
  let equation = <></>;
  let equationLatex = '';

  // Correction : r2 peut être un objet (ex: {r2: ..., chi2: ...}) ou un nombre
  let r2Value = model.r2;
  if (typeof r2Value === 'object' && r2Value !== null && 'r2' in r2Value) {
    r2Value = r2Value.r2;
  }

  // Génération dynamique de l'équation avec les coefficients formatés pour tous les modèles
  switch(selectedModel) {
    case "linear":
      equationLatex = `y = ${formatNumber(coeffs[0])} \\; x ${formatSignedNumber(coeffs[1], formatNumber)}`;
      break;
    case "polynomial2": {
      const [a, b, c] = coeffs;
      equationLatex = `y = ${formatNumber(a)} \\; x^2 ${formatSignedNumber(b, formatNumber)} \\; x ${formatSignedNumber(c, formatNumber)}`;
      break;
    }
    case "polynomial3": {
      const [a, b, c, d] = coeffs;
      equationLatex = `y = ${formatNumber(a)} \\; x^3 ${formatSignedNumber(b, formatNumber)} \\; x^2 ${formatSignedNumber(c, formatNumber)} \\; x ${formatSignedNumber(d, formatNumber)}`;
      break;
    }
    case "logarithmic10": {
      const [a, b] = coeffs;
      equationLatex = `y = ${formatNumber(a)} ${formatSignedNumber(b, formatNumber)} \\; \\log_{10}(x)`;
      break;
    }
    case "logarithmicE": {
      const [a, b] = coeffs;
      equationLatex = `y = ${formatNumber(a)} ${formatSignedNumber(b, formatNumber)} \\; \\ln(x)`;
      break;
    }
    case "exponential": {
      // ATTENTION : ml-regression retourne [b, a] pour y = a·e^{b·x}
      const [b, a] = coeffs;
      equationLatex = `y = ${formatNumber(a)} \\; e^{${formatNumber(b)} x}`;
      break;
    }
    case "power": {
      const [a, b] = coeffs;
      equationLatex = `y = ${formatNumber(a)} \\; x^{${formatNumber(b)}}`;
      break;
    }
    default:
      equationLatex = '';
  }

  return (
    <div className="mt-4">
      <div className='flex flex-col items-center gap-2'>
        <TeX math={equationLatex} />
        {/* <span className="text-xs text-gray-500">(coefficients à 4 chiffres significatifs)</span> */}
      </div>
      <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 300, mx: 'auto' }}>
        <Table size="small">
          <TableBody>
            {coeffs.map((coef: number, i: number) => (
              <TableRow key={i}>
                <TableCell>
                  <TeX math={symbols[i]} />
                </TableCell>
                <TableCell align="right">
                  <TeX math={formatNumber(coef)} />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TeX math="R^2" />
              </TableCell>
              <TableCell align="right">
                <TeX math={formatNumber(r2Value)} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export const RegressionModelSelector: React.FC<RegressionModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  stats,
  formatNumber
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-center">
        <Select
          value={selectedModel}
          onChange={onModelChange}
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
      {renderEquationAndCoefficients(stats, selectedModel, formatNumber || ((num: number) => num.toString()))}
    </div>
  );
};