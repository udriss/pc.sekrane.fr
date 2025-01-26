import React from 'react';
import TeX from '@matejmazur/react-katex';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

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
    <TableContainer component={Paper} className="h-full shadow-none" sx={{ boxShadow: 'none' }}>
      <Table className='h-full'>
        <TableHead>
          <TableRow>
            <TableCell>Paramètre</TableCell>
            <TableCell align="right">Valeur</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell><TeX math="\overline{X}" /></TableCell>
            <TableCell align="right"><TeX math={formatNumber(stats.meanX)} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><TeX math="\bar{Y}" /></TableCell>
            <TableCell align="right"><TeX math={formatNumber(stats.meanY)} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><TeX math="\sigma^2_X" /></TableCell>
            <TableCell align="right"><TeX math={formatNumber(stats.varianceX)} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><TeX math="\sigma^2_Y" /></TableCell>
            <TableCell align="right"><TeX math={formatNumber(stats.varianceY)} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><TeX math="Cov(X,Y)" /></TableCell>
            <TableCell align="right"><TeX math={formatNumber(stats.covariance)} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><TeX math="r_{X,Y}" /></TableCell>
            <TableCell align="right"><TeX math={formatNumber(stats.correlation)} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><TeX math="R^2" /></TableCell>
            <TableCell align="right"><TeX math={formatNumber(Math.pow(stats.correlation, 2))} /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};