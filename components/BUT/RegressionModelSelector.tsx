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

  switch(selectedModel) {
    case "linear":
      equation = <TeX math="y = ax + b" />;
      break;
    case "polynomial2":
      equation = <TeX math="y = ax^2 + bx + c" />;
      break;
    case "polynomial3":
      equation = <TeX math="y = ax^3 + bx^2 + cx + d" />;
      break;
    case "logarithmic10":
      equation = <TeX math="y = a + b\log_{10}(x)" />;
      break;
    case "logarithmicE":
      equation = <TeX math="y = a + b\ln(x)" />;
      break;
    case "exponential":
      equation = <TeX math="y = ae^{bx}" />;
      break;
    case "power":
      equation = <TeX math="y = ax^b" />;
      break;
    default:
      equation = <></>;
  }

  return (
    <div className="mt-4">
      <div className='flex justify-center'>
        {equation}
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
                <TeX math={formatNumber(model.r2)} />
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