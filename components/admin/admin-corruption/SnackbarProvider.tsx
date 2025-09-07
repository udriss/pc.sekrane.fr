// /components/admin/admin-corruption/SnackbarProvider.tsx

import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarProviderProps {
  snackbarState: {
    snackbarOpen: boolean;
    snackbarMessage: React.ReactNode;
    snackbarSeverity: 'success' | 'error' | 'info' | 'warning';
    handleCloseSnackbar: (_?: React.SyntheticEvent | Event, reason?: string) => void;
  };
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ snackbarState }) => {
  const { snackbarOpen, snackbarMessage, snackbarSeverity, handleCloseSnackbar } = snackbarState;

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};
