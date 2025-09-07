'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StartPageClient from './StartPageClient';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import Cookies from 'js-cookie';

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    async function loadSession() {
      const passSessionCookie = Cookies.get('passSession');
      
      if (!passSessionCookie) {
        router.push('/escapenext');
        return;
      }

      try {
        // Appel à l'API pour récupérer les données de session
        const response = await fetch('/api/get-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ passSession: passSessionCookie })
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.ID) {
          router.push('/escapenext');
          return;
        }

        setSessionData(data);
      } catch (error) {
        console.error("Error loading session:", error);
        setError("Erreur lors du chargement de la session. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [router]);

  // Si la page est en chargement, afficher une animation de chargement
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Chargement de votre session...</Typography>
      </Box>
    );
  }

  // Si une erreur s'est produite, afficher un message d'erreur
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        px: 3
      }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3, maxWidth: 600 }}
        >
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Impossible de charger les données de session. Veuillez retourner à la page d&apos;accueil.
        </Typography>
        <button 
          onClick={() => router.push('/escapenext')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retour à l&apos;accueil
        </button>
      </Box>
    );
  }

  // Si les données de session sont chargées avec succès, afficher le composant client
  return sessionData ? (
    <StartPageClient gameId={sessionData.ID} sessionData={sessionData} />
  ) : null;
}