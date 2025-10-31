import React from 'react';
import Link from 'next/link';
import { Paper, Typography, Button, Box, Stack, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import LogoutIcon from '@mui/icons-material/Logout';

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
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Panneau admin
        </Typography>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 2',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <IconButton
          component={Link}
          href="/admin/depots"
          color="primary"
          sx={{ mr: 1 }}
          title="Gestion des dépôts"
        >
          <FolderIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={onLogout}
          title="Déconnexion"
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}