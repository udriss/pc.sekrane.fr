import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        p: 2,
        border: '1px solid',
        borderColor: 'error.main',
      }}
    >
      <Box
        color='error.main'
        sx={{
          gridColumn: 'span 3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Panneau admin
        </Typography>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 2',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={onLogout}
          sx={{
            fontWeight: 'bold',
          }}
        >
          Déconnexion
        </Button>
      </Box>
    </Paper>
  );
}