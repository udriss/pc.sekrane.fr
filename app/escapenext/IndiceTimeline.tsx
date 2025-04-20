'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  styled,
  LinearProgress,
  Grid,
  Card,
  Button
} from '@mui/material';
import { 
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface IndiceTimelineProps {
  scoreS: number;
  scoreC: number;
  scoreR: number;
  onIndiceClick: (indiceId: number) => void;
}

// Définition des critères de déblocage des indices
const indiceRequirements = [
  { level: 1, requirements: { S: 2, C: 2, R: 2 }, label: 'Indice 1' },
  { level: 2, requirements: { S: 3, C: 3, R: 3 }, label: 'Indice 2' },
  { level: 3, requirements: { S: 6, C: 4, R: 4 }, label: 'Indice 3' },
  { level: 4, requirements: { S: 6, C: 5, R: 4 }, label: 'Indice 4' },
  { level: 5, requirements: { S: 8, C: 5, R: 4 }, label: 'Indice 5' },
  { level: 6, requirements: { S: 10, C: 5, R: 4 }, label: 'Indice 6' },
  { level: 7, requirements: { S: 10, C: 6, R: 5 }, label: 'Indice 7' }
];

// Styles pour les éléments de la timeline
const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 2),
  marginTop: theme.spacing(2),
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%', // Centré horizontalement
    transform: 'translateX(-50%)', // Assure le centrage parfait
    width: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  }
}));

const TimelineItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCompleted' && prop !== 'isActive',
})<{ isCompleted: boolean; isActive: boolean }>(({ theme, isCompleted, isActive }) => ({
  position: 'relative',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center', // Centre la carte sur l'axe horizontal
  '&:last-child': {
    paddingBottom: 0,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: 'translateX(-50%)',
    width: 16,
    height: 16,
    borderRadius: '50%',
    zIndex: 2,
    backgroundColor: isCompleted 
      ? theme.palette.success.main 
      : isActive 
        ? theme.palette.primary.main 
        : theme.palette.grey[400],
    border: `2px solid ${isCompleted 
      ? theme.palette.success.light
      : isActive 
        ? theme.palette.primary.light
        : theme.palette.grey[300]
    }`,
    boxShadow: isCompleted || isActive 
      ? '0 2px 4px rgba(0,0,0,0.2)' 
      : 'none',
  },
  '&:after': {
    content: isCompleted ? '"✓"' : isActive ? '"!"' : '""',
    position: 'absolute',
    left: '50%',
    top: isCompleted || isActive ? 1 : 0,
    transform: 'translateX(-50%)',
    color: '#fff',
    fontSize: '0.6rem',
    fontWeight: 'bold',
    zIndex: 3,
  }
}));

const IndiceCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isCompleted' && prop !== 'isActive',
})<{ isCompleted: boolean; isActive: boolean }>(({ theme, isCompleted, isActive }) => ({
  padding: theme.spacing(1.5),
  width: '95%', // Légèrement plus étroit que la largeur complète pour un meilleur rendu
  maxWidth: '100%',
  borderRadius: theme.spacing(1),
  boxShadow: isActive 
    ? '0 3px 8px rgba(25, 118, 210, 0.15)' 
    : isCompleted 
      ? '0 2px 6px rgba(76, 175, 80, 0.1)' 
      : '0 1px 2px rgba(0,0,0,0.08)',
  borderTop: `3px solid ${
    isCompleted 
      ? theme.palette.success.main 
      : isActive 
        ? theme.palette.primary.main
        : theme.palette.grey[300]
  }`, // Bordure en haut au lieu de la gauche
  borderLeft: 'none', // Suppression de la bordure gauche
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: isCompleted ? 'translateY(-2px)' : 'none',
    boxShadow: isCompleted 
      ? '0 4px 8px rgba(76, 175, 80, 0.15)' 
      : isActive 
        ? '0 3px 8px rgba(25, 118, 210, 0.15)' 
        : '0 1px 2px rgba(0,0,0,0.08)',
  }
}));

const IndiceTimeline: React.FC<IndiceTimelineProps> = ({ scoreS, scoreC, scoreR, onIndiceClick }) => {
  // Calculer le nombre d'indices débloqués
  const getUnlockedCount = () => {
    let count = 0;
    
    for (const indice of indiceRequirements) {
      if (
        scoreS >= indice.requirements.S && 
        scoreC >= indice.requirements.C && 
        scoreR >= indice.requirements.R
      ) {
        count = indice.level;
      } else {
        break;
      }
    }
    
    return count;
  };

  const unlockedCount = getUnlockedCount();
  
  // Calculer le prochain indice à débloquer et ce qu'il manque
  const getNextIndiceRequirements = () => {
    if (unlockedCount >= indiceRequirements.length) {
      return null;
    }
    
    const nextIndice = indiceRequirements[unlockedCount];
    return {
      indice: nextIndice,
      missing: {
        S: Math.max(0, nextIndice.requirements.S - scoreS),
        C: Math.max(0, nextIndice.requirements.C - scoreC),
        R: Math.max(0, nextIndice.requirements.R - scoreR)
      }
    };
  };
  
  const nextRequirement = getNextIndiceRequirements();

  return (
    <Paper elevation={2} sx={{ p: 2, width: '100%', maxWidth: 800 }}>
      
      {unlockedCount === indiceRequirements.length ? (
        <Box sx={{  p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="success.main" fontWeight="bold">
            Félicitations ! Vous avez débloqué tous les indices.
          </Typography>
        </Box>
      ) : nextRequirement && (
        <Box sx={{ p: 1.5, bgcolor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" fontWeight="bold">
            il vous reste {indiceRequirements.length - unlockedCount} indice{indiceRequirements.length - unlockedCount > 1 ? 's' : ''} à débloquer
          </Typography>
        </Box>
      )}
      
      {/* Nouvelle Timeline */}
      <TimelineContainer>
        {indiceRequirements.map((indice, index) => {
          const isCompleted = index < unlockedCount;
          const isActive = index === unlockedCount;
          
          // Calculer la progression individuelle pour chaque critère
          const progressS = Math.min(100, (scoreS / indice.requirements.S) * 100);
          const progressC = Math.min(100, (scoreC / indice.requirements.C) * 100);
          const progressR = Math.min(100, (scoreR / indice.requirements.R) * 100);
          
          // Déterminer si chaque critère est rempli
          const isCriteriaMetS = scoreS >= indice.requirements.S;
          const isCriteriaMetC = scoreC >= indice.requirements.C;
          const isCriteriaMetR = scoreR >= indice.requirements.R;
          
          return (
            <TimelineItem key={indice.level} isCompleted={isCompleted} isActive={isActive}>
              <IndiceCard isCompleted={isCompleted} isActive={isActive}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isCompleted ? 0 : 0.5 }}>
                  <Typography variant={isActive ? "subtitle1" : "body1"} fontWeight="bold" color={isCompleted ? 'success.main' : (isActive ? 'primary.main' : 'text.primary')}>
                    {indice.label}
                  </Typography>
                  
                  {isCompleted ? (
                    <Button 
                      variant="text" 
                      color="success" 
                      size="small"
                      startIcon={<LockOpenIcon fontSize="small" />}
                      onClick={() => onIndiceClick(indice.level)}
                      sx={{ 
                        py: 0,
                        fontSize: '1rem',
                        textTransform: 'none',
                        fontVariant: 'small-caps',
                      }}
                    >
                      voir indice
                    </Button>
                  ) : isActive ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" color="primary.main" fontWeight="medium">
                        En progression
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LockIcon color="action" fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                      <Typography variant="caption" color="text.secondary">
                        Verrouillé
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {!isCompleted && isActive && (
                  <Box sx={{ mt: 1 }}>
                    <Grid container spacing={0.5}>
                      {/* Structure */}
                      <Grid size={{ xs:12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ minWidth: 70 }}>
                            <Typography variant="caption" fontWeight="medium" color="text.secondary">
                              Structure:
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', mr: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progressS}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: isCriteriaMetS ? '#4caf50' : '#3f51b5',
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 40, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight="medium" color={isCriteriaMetS ? 'success.main' : 'text.secondary'}>
                              {scoreS} / {indice.requirements.S}
                            </Typography>
                            {isCriteriaMetS && <CheckIcon color="success" sx={{ ml: 0.25, fontSize: '0.7rem' }} />}
                          </Box>
                        </Box>
                      </Grid>
                      
                      {/* Conquête */}
                      <Grid size={{ xs:12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ minWidth: 70 }}>
                            <Typography variant="caption" fontWeight="medium" color="text.secondary">
                              Conquête:
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', mr: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progressC}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: isCriteriaMetC ? '#4caf50' : '#2196f3',
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 40, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight="medium" color={isCriteriaMetC ? 'success.main' : 'text.secondary'}>
                              {scoreC} / {indice.requirements.C}
                            </Typography>
                            {isCriteriaMetC && <CheckIcon color="success" sx={{ ml: 0.25, fontSize: '0.7rem' }} />}
                          </Box>
                        </Box>
                      </Grid>
                      
                      {/* Rébus */}
                      <Grid size={{ xs:12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ minWidth: 70 }}>
                            <Typography variant="caption" fontWeight="medium" color="text.secondary">
                              Rébus:
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', mr: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progressR}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: isCriteriaMetR ? '#4caf50' : '#9c27b0',
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 40, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight="medium" color={isCriteriaMetR ? 'success.main' : 'text.secondary'}>
                              {scoreR} / {indice.requirements.R}
                            </Typography>
                            {isCriteriaMetR && <CheckIcon color="success" sx={{ ml: 0.25, fontSize: '0.7rem' }} />}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 0.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="primary.main" sx={{ fontStyle: 'italic', fontSize: '0.65rem' }}>
                        Complétez tous les critères pour débloquer cet indice
                      </Typography>
                    </Box>
                  </Box>
                )}
              </IndiceCard>
            </TimelineItem>
          );
        })}
      </TimelineContainer>
    </Paper>
  );
};

export default IndiceTimeline;