'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  Card, 
  CardContent, 
  Button, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  TextField,
  Container,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  PlayArrow as PlayArrowIcon, 
  Restore as RestoreIcon,
  Add as AddIcon, 
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Définir les interfaces pour typer correctement les données
interface Question {
  ID: number;
  question?: string;
  reponse: string;
}

interface SessionData {
  ID: number;
  gameId?: number;
  passSession: string;
  scores: {
    S: number;
    C: number;
    R: number;
    E: number;
  };
  questions: {
    conquete: Question[];
    structure: Question[];
    rebus: Question[];
    enigmes: Question[];
  };
  answeredQuestionsS?: string;
  answeredQuestionsC?: string;
  answeredQuestionsR?: string;
  updated_at?: string;
}

// Composant stylisé pour l'entrée du code de session
const SessionCodeInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const CodeInput = styled(TextField)(({ theme }) => ({
  width: '3rem',
  '& .MuiOutlinedInput-root': {
    height: '3rem',
    width: '3rem',
    fontSize: '1.5rem',
    textAlign: 'center',
    padding: 0,
    '& input': {
      textAlign: 'center',
    }
  }
}));

const EscapePage: React.FC = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<{
    conquete: Question[];
    structure: Question[];
    rebus: Question[];
    enigmes: Question[];
  }>({
    conquete: [],
    structure: [],
    rebus: [],
    enigmes: [],
  });
  const [otpValues, setOtpValues] = useState<string[]>(Array(7).fill(''));
  const [gameId, setGameId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSession, setDetectedSession] = useState<string | null>(null);
  const router = useRouter();
  
  // Refs pour les inputs de code
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(Array(7).fill(null));

  // Vérifier s'il existe déjà une session au chargement de la page
  useEffect(() => {
    const existingSession = Cookies.get('passSession');
    if (existingSession) {
      setDetectedSession(existingSession);
    }
  }, []);

  const handleContinueSession = () => {
    if (detectedSession) {
      router.push('/escapenext/start');
    }
  };

  const handleStartNewGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      
      const response = await axios.post<SessionData>('/api/init-session');
      const data = response.data;
      
      
      setSessionData(data);
      setQuestions(data.questions);
      setGameId(data.ID || data.gameId || 0);
      
      // Ensure we have a valid session ID/gameId
      if (!data.ID && !data.gameId) {
        throw new Error("No valid session ID returned from API");
      }
      
      // Clear existing cookies first
      Cookies.remove('passSession');
      
      // Store passSession in cookie
      Cookies.set('passSession', data.passSession, { 
        expires: 1, // 1 day
        path: '/',
        sameSite: 'strict'
      });
      
      
      
      // Use a small delay to ensure cookie is properly set
      setTimeout(() => {
        router.push('/escapenext/start');
      }, 100);
      
    } catch (error) {
      console.error('Failed to initialize session:', error);
      setError("Erreur lors de l'initialisation de la session. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des changements dans les inputs de code de session
  const handleCodeInputChange = (index: number, value: string) => {
    const newValues = [...otpValues];
    
    // Ne garder que le premier caractère
    newValues[index] = value.substring(0, 1);
    setOtpValues(newValues);

    // Si un caractère a été entré, passer au champ suivant
    if (value && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Gestion des backspaces dans les inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // Si le champ actuel est vide et que l'utilisateur appuie sur Backspace, revenir au champ précédent
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleRestoreSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otp = otpValues.join('');
    if (!otp || otp.length !== 7) {
      setError("Veuillez entrer un code de session valide (7 caractères)");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      
      
      // Clear existing cookies first
      Cookies.remove('passSession');
      
      // Set the passSession cookie first
      Cookies.set('passSession', otp, { 
        expires: 1, // 1 day
        path: '/',
        sameSite: 'strict'
      });
      
      // Then retrieve the session data
      const response = await axios.post<SessionData>('/api/get-session', { passSession: otp });
      const data = response.data;
      
      if (!data || (!data.ID && !data.gameId)) {
        throw new Error("Session invalide ou expirée");
      }
      
      
      
      // Use a small delay to ensure cookie is properly set
      setTimeout(() => {
        router.push('/escapenext/start');
      }, 100);
      
    } catch (error) {
      console.error('Failed to restore session:', error);
      // Remove the cookie if restoration failed
      Cookies.remove('passSession');
      setError("Session introuvable ou expirée. Veuillez vérifier votre code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 15, mb: 5 }}>
      <Card elevation={3}>
        {detectedSession ? (
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
              Session existante détectée
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Une session de jeu a été détectée (code: <Box component="span" fontWeight="bold">{detectedSession}</Box>). 
              Que souhaitez-vous faire ?
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              <Grid >
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={handleContinueSession}
                  startIcon={<ArrowForwardIcon />}
                  sx={{ px: 3, py: 1.5, fontWeight: "bold" }}
                >
                  Continuer cette partie
                </Button>
              </Grid>
              
              <Grid>
                <Button 
                  variant="contained" 
                  color="warning" 
                  onClick={() => {
                    // Supprimer le cookie existant et rafraîchir la page
                    Cookies.remove('passSession', { path: '/' });
                    setDetectedSession(null);
                  }}
                  startIcon={<AddIcon />}
                  sx={{ px: 3, py: 1.5, fontWeight: "bold" }}
                >
                  Nouvelle partie
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        ) : (
          <>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Initialisation
              </Typography>
              <Typography variant="body1" paragraph>
                Bienvenue dans cet escape game !
              </Typography>
              <Typography variant="body1">
                Les thèmes traités dans ce jeu sont les suivants :
              </Typography>
              
              <List sx={{ width: 'fit-content', mx: 'auto', mb: 2 }}>
                <ListItem dense>
                  <ListItemText primary="Structures célestes" />
                </ListItem>
                <ListItem dense>
                  <ListItemText primary="Découvertes spatiales majeures" />
                </ListItem>
                <ListItem dense>
                  <ListItemText primary="Rébus" />
                </ListItem>
                <ListItem dense>
                  <ListItemText primary="Énigmes" />
                </ListItem>
              </List>
              
              <Box textAlign="center">
                <Button 
                  variant="contained" 
                  onClick={handleStartNewGame}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                  sx={{ px: 3, py: 1.5 }}
                >
                  {isLoading ? 'Chargement...' : 'Lancer le jeu'}
                </Button>
              </Box>
            </CardContent>

            <Divider />

            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Restaurer session
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Rentrer un code session pour restaurer :
              </Typography>
              
              <form onSubmit={handleRestoreSession} name='login'>
                <SessionCodeInput>
                  {Array(7).fill(0).map((_, index) => (
                    <CodeInput
                      key={index}
                      inputRef={(el) => inputRefs.current[index] = el}
                      value={otpValues[index]}
                      onChange={(e) => handleCodeInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      variant="outlined"
                      inputProps={{ 
                        maxLength: 1,
                        style: { textAlign: 'center' },
                        disabled: isLoading
                      }}
                    />
                  ))}
                </SessionCodeInput>
                
                <Box textAlign="center" mt={3}>
                  <Button 
                    type='submit'
                    variant="contained" 
                    color="secondary"
                    disabled={isLoading || otpValues.join('').length !== 7}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RestoreIcon />}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    {isLoading ? 'Chargement...' : 'Restaurer la session'}
                  </Button>
                </Box>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mt: 3 }}
                  >
                    {error}
                  </Alert>
                )}
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </Container>
  );
};

export default EscapePage;