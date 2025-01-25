import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

// MathJax configuration
const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]]
  }
};

interface RegressionStats {
  slope: number;
  intercept: number;
}

interface Stats {
  meanX: number;
  meanY: number;
  varianceX: number;
  varianceY: number;
  covariance: number;
  correlation: number;
  regression: RegressionStats;
}

interface StatsTableProps {
  stats: Stats;
  formatNumber: (num: number) => string;
}

export const StatsTable: React.FC<StatsTableProps> = ({ stats, formatNumber }) => {
  return (
    <MathJaxContext config={config}>
      <TableContainer component={Paper} className="mt-4 shadow-none" sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paramètre</TableCell>
              <TableCell align="right">Valeur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><MathJax>{`$\\bar{X}$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.meanX)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$\\bar{Y}$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.meanY)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$\\sigma^2_X$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.varianceX)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$\\sigma^2_Y$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.varianceY)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$Cov(X,Y)$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.covariance)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$\\alpha$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.regression?.slope)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$\\beta$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.regression?.intercept)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$r_{X,Y}$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(stats.correlation)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><MathJax>{`$R^2$`}</MathJax></TableCell>
              <TableCell align="right">{formatNumber(Math.pow(stats.correlation, 2))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </MathJaxContext>
  );
};