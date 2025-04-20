'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grid,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

// Configuration des exigences d'indices pour chaque énigme
const ENIGMES_REQUIREMENTS = [
  { id: 0, indicesRequired: 3, title: 'Énigme 1' },
  { id: 1, indicesRequired: 4, title: 'Énigme 2' },
  { id: 2, indicesRequired: 5, title: 'Énigme 3' },
  { id: 3, indicesRequired: 6, title: 'Énigme 4 - Format papier' },
  { id: 4, indicesRequired: 7, title: 'Énigme 5 - Format papier' }
];

// Types pour les props du composant
interface EnigmeDisplayProps {
  scoreS: number;
  scoreC: number;
  scoreR: number;
  unlockedIndicesCount: number;
  enigmes: Array<{ 
    id: number;
    question: string;
    requiresPaper?: boolean;
    paperCode?: string;
  }>;
  onSubmitAnswer: (enigmeId: number, answer: string) => Promise<boolean>;
  onEnigmeComplete?: (enigmeId: number) => void;
  completedEnigmes: number[];
}

const EnigmeDisplay: React.FC<EnigmeDisplayProps> = ({
  scoreS,
  scoreC,
  scoreR,
  unlockedIndicesCount,
  enigmes,
  onSubmitAnswer,
  onEnigmeComplete,
  completedEnigmes
}) => {
  const [selectedEnigme, setSelectedEnigme] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Vérifier si une énigme est déverrouillée en fonction du nombre d'indices débloqués
  // ou des énigmes précédentes complétées
  const isEnigmeUnlocked = (enigmeId: number): boolean => {
    // Logique spéciale pour les énigmes 3 et 4 (format papier)
    if (enigmeId === 3) {
      // L'énigme 4 est déverrouillée si l'énigme 3 est complétée
      return completedEnigmes.includes(2);
    }
    
    if (enigmeId === 4) {
      // L'énigme 5 est déverrouillée si l'énigme 4 est complétée
      return completedEnigmes.includes(3);
    }
    
    // Pour les autres énigmes, utiliser la logique basée sur les indices
    const enigme = ENIGMES_REQUIREMENTS.find(e => e.id === enigmeId);
    if (!enigme) return false;
    return unlockedIndicesCount >= enigme.indicesRequired;
  };

  // Calculer le nombre d'indices manquants pour débloquer une énigme
  const getMissingIndicesCount = (enigmeId: number): number => {
    const enigme = ENIGMES_REQUIREMENTS.find(e => e.id === enigmeId);
    if (!enigme) return 0;
    return Math.max(0, enigme.indicesRequired - unlockedIndicesCount);
  };

  // Gérer l'ouverture d'une énigme
  const handleOpenEnigme = (enigmeId: number) => {
    if (isEnigmeUnlocked(enigmeId)) {
      setSelectedEnigme(enigmeId);
      setAnswer('');
      setFeedback(null);
    }
  };

  // Gérer la fermeture d'une énigme
  const handleCloseEnigme = () => {
    setSelectedEnigme(null);
  };

  // Gérer la soumission d'une réponse
  const handleSubmitAnswer = async () => {
    if (selectedEnigme === null || !answer.trim()) return;
    
    setIsSubmitting(true);
    setFeedback(null);
    
    try {
      const isCorrect = await onSubmitAnswer(selectedEnigme, answer.trim());
      
      if (isCorrect) {
        setFeedback({
          type: 'success',
          message: 'Bonne réponse! 🎉'
        });
        setAnswer('');
        
        // Notifier que l'énigme est complétée
        if (onEnigmeComplete) {
          onEnigmeComplete(selectedEnigme);
        }
      } else {
        setFeedback({
          type: 'error',
          message: 'Mauvaise réponse. Essayez encore.'
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Une erreur est survenue lors de la vérification de votre réponse.'
      });
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trouver l'énigme sélectionnée
  const selectedEnigmeData = selectedEnigme !== null 
    ? enigmes.find(e => e.id === selectedEnigme) 
    : null;

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: 3, 
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#1a237e',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            backgroundColor: '#303f9f',
            borderRadius: '2px'
          }
        }}
      >
        Énigmes spéciales
      </Typography>
      
      <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Progressez dans chaque catégorie pour débloquer des indices qui vous permettront d'accéder aux énigmes spéciales.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 'medium' }}>
            Indices débloqués:
          </Typography>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={(unlockedIndicesCount / 7) * 100} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#3f51b5'
                }
              }} 
            />
          </Box>
          <Chip 
            label={`${unlockedIndicesCount}/7`} 
            size="small" 
            variant="filled"
            color="primary"
          />
        </Box>
      </Box>

      <Grid container spacing={2}>
        {ENIGMES_REQUIREMENTS.map((enigme) => {
          const isUnlocked = isEnigmeUnlocked(enigme.id);
          const missingIndices = getMissingIndicesCount(enigme.id);
          const isCompleted = completedEnigmes.includes(enigme.id);
          
          return (
            <Grid key={enigme.id} size={{ xs:12, sm:6 }}>
              <Paper 
                elevation={3} 
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isCompleted 
                    ? 'success.light' 
                    : (isUnlocked ? 'primary.light' : 'divider'),
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': isUnlocked ? {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  } : {}
                }}
              >
                {/* Badge pour énigme complétée */}
                {isCompleted && (
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: -30,
                      transform: 'rotate(45deg)',
                      bgcolor: 'success.main',
                      color: 'white',
                      py: 0.5,
                      width: 120,
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  >
                    COMPLÉTÉ
                  </Box>
                )}
                
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 1
                }}>
                  {isUnlocked ? (
                    <LockOpenIcon color="primary" sx={{ fontSize: 40 }} />
                  ) : (
                    <LockIcon color="action" sx={{ fontSize: 40 }} />
                  )}
                </Box>
                
                <Typography 
                  variant="h6" 
                  component="h3" 
                  align="center"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {enigme.title}
                </Typography>
                
                <Box sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 1
                }}>
                  {!isUnlocked ? (
                    <Box sx={{ textAlign: 'center' }}>
                      {enigme.id === 3 ? (
                        <Typography variant="body2" color="text.secondary">
                          Verrouillé • Terminez l'Énigme 3 pour débloquer
                        </Typography>
                      ) : enigme.id === 4 ? (
                        <Typography variant="body2" color="text.secondary">
                          Verrouillé • Terminez l'Énigme 4 pour débloquer
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Verrouillé • Indice requis: {enigme.indicesRequired}/7
                        </Typography>
                      )}
                      {enigme.id !== 3 && enigme.id !== 4 && (
                        <Typography 
                          variant="body2" 
                          color="error" 
                          sx={{ mt: 1, fontWeight: 'medium' }}
                        >
                          Il vous manque {missingIndices} indice{missingIndices > 1 ? 's' : ''}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                      {isCompleted 
                        ? 'Vous avez résolu cette énigme!' 
                        : 'Cette énigme est débloquée. Cliquez pour commencer.'}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant={isUnlocked ? "contained" : "outlined"}
                    color={isUnlocked ? "primary" : "inherit"}
                    onClick={() => handleOpenEnigme(enigme.id)}
                    disabled={!isUnlocked}
                    sx={{ 
                      minWidth: 150,
                      borderRadius: 5,
                      textTransform: 'none'
                    }}
                  >
                    {isUnlocked ? "Ouvrir l'énigme" : "Verrouillé"}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal d'énigme */}
      <Dialog
        open={selectedEnigme !== null}
        onClose={handleCloseEnigme}
        maxWidth="md"
        fullWidth
      >
        {selectedEnigmeData && (
          <>
            <DialogTitle sx={{ 
              bgcolor: '#f5f5f5', 
              display: 'flex', 
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 3
            }}>
              <Typography variant="h5" component="div" align="center" fontWeight="bold">
                {selectedEnigme !== null && ENIGMES_REQUIREMENTS.find(e => e.id === selectedEnigme)?.title}
              </Typography>
              {selectedEnigme !== null && completedEnigmes.includes(selectedEnigme) && (
                <Chip 
                  label="COMPLÉTÉ" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 1 }} 
                />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" >
                  {selectedEnigmeData.question}
                </Typography>
                
                {selectedEnigmeData.requiresPaper && selectedEnigmeData.paperCode && (
                  <Box sx={{ 
                    bgcolor: '#fff3e0', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 3,
                    border: '1px dashed #ff9800'
                  }}>
                    <Typography variant="subtitle2" color="warning.dark" fontWeight="medium">
                      Format papier requis
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Pour résoudre cette énigme, demandez la version papier au code: <strong>{selectedEnigmeData.paperCode}</strong>
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                {feedback && (
                  <Alert 
                    severity={feedback.type} 
                    sx={{ mb: 2 }}
                    variant="filled"
                  >
                    {feedback.message}
                  </Alert>
                )}
                
                {selectedEnigme !== null && !completedEnigmes.includes(selectedEnigme) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Votre réponse:
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Entrez votre réponse ici..."
                      sx={{ mb: 2 }}
                      slotProps={{
                        input: {
                          sx: {
                            borderRadius: 2,
                            '&:focus': {
                              borderColor: 'primary.main',
                              boxShadow: '0 0 0 4px rgba(63, 81, 181, 0.2)'
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
              <Button 
                onClick={handleCloseEnigme}
                variant="outlined"
                color="inherit"
              >
                Fermer
              </Button>
              
              {selectedEnigme !== null && !completedEnigmes.includes(selectedEnigme) && (
                <Button 
                  onClick={handleSubmitAnswer}
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || !answer.trim()}
                >
                  {isSubmitting ? 'Vérification...' : 'Vérifier ma réponse'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EnigmeDisplay;