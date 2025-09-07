"use client";

import React, { useEffect, useRef } from 'react';
import NextLink from "next/link";
import './globals.css'; // Importer le fichier CSS pour les styles globaux
import { generateFingerprint } from '@/lib/fingerprint';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Home() {
  const initialized = useRef(false);

  const initFingerprint = async () => {
    if (initialized.current) return;
    
    try {
      const deviceId = await generateFingerprint();
      localStorage.setItem('deviceFingerprint', deviceId);
      initialized.current = true;
    } catch (error) {
      console.error('Error generating fingerprint:', error);
    }
  };
  
  useEffect(() => {
    initFingerprint();
  }, []);

  return (
    <Box
      className="app-container"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      <Box textAlign="center" sx={{ maxWidth: 672, width: '100%' }}>
        <Stack spacing={3}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Plan de travail et activités
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Accédez à vos cours et activités en SPC et SNT
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Site web de M.{' '}
            <Box component="span" sx={{ fontVariant: 'small-caps' }}>
              Sekrane
            </Box>{' '}
            <Box component="br" />
          </Typography>

          <Button
            component={NextLink}
            href="/courses"
            size="large"
            variant="outlined"
            sx={{ mt: 2, fontWeight: 'bold' }}
          >
            Voir les cours
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}