'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Stack,
  ImageList,
  ImageListItem
} from '@mui/material';

interface IndiceDisplayProps {
  scoreS: number;
  scoreC: number;
  scoreR: number;
}

const IndiceDisplay: React.FC<IndiceDisplayProps> = ({ scoreS, scoreC, scoreR }) => {
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  useEffect(() => {
    
    
    // Reset count and debug info
    let count = 0;
    const debugMessages: string[] = [];
    
    // Vérification indépendante pour chaque niveau d'indice
    if (scoreS >= 2 && scoreC >= 2 && scoreR >= 2) {
      count = 1;
      debugMessages.push("Indice 1 débloqué: S≥2, C≥2, R≥2");
    }
    
    if (scoreS >= 3 && scoreC >= 3 && scoreR >= 3) {
      count = 2;
      debugMessages.push("Indice 2 débloqué: S≥3, C≥3, R≥3");
    }
    
    if (scoreS >= 6 && scoreC >= 4 && scoreR >= 4) {
      count = 3;
      debugMessages.push("Indice 3 débloqué: S≥6, C≥4, R≥4");
    }
    
    if (scoreS >= 6 && scoreC >= 5 && scoreR >= 4) {
      count = 4;
      debugMessages.push("Indice 4 débloqué: S≥6, C≥5, R≥4");
    }
    
    if (scoreS >= 8 && scoreC >= 5 && scoreR >= 4) {
      count = 5;
      debugMessages.push("Indice 5 débloqué: S≥8, C≥5, R≥4");
    }
    
    if (scoreS >= 10 && scoreC >= 5 && scoreR >= 4) {
      count = 6;
      debugMessages.push("Indice 6 débloqué: S≥10, C≥5, R≥4");
    }
    
    if (scoreS >= 10 && scoreC >= 6 && scoreR >= 5) {
      count = 7;
      debugMessages.push("Indice 7 débloqué: S≥10, C≥6, R≥5");
    }
    
    
    setUnlockedCount(count);
    setDebugInfo(debugMessages);
  }, [scoreS, scoreC, scoreR]);

  return (
    <Paper elevation={2} sx={{ p: 3, width: '100%', maxWidth: 800 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        Indices Débloqués ({unlockedCount}/7)
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pour débloquer plus d'indices, améliorez vos scores dans chaque catégorie.
      </Typography>
      
      {unlockedCount > 0 ? (
        <ImageList cols={unlockedCount > 2 ? 3 : unlockedCount} gap={16} sx={{ maxHeight: 'none' }}>
          {Array.from({ length: unlockedCount }).map((_, index) => (
            <ImageListItem key={index} sx={{ overflow: 'hidden', borderRadius: 1 }}>
              <Box
                component="img"
                src={`/api/indices?id=${index + 1}`}
                alt={`Indice ${index + 1}`}
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Typography 
                variant="caption" 
                align="center" 
                sx={{ 
                  display: 'block', 
                  mt: 0.5, 
                  fontWeight: 'medium', 
                  color: 'primary.main' 
                }}
              >
                Indice {index + 1}
              </Typography>
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          p: 3, 
          bgcolor: 'rgba(0,0,0,0.03)', 
          borderRadius: 2,
          border: '1px dashed #ccc'
        }}>
          <Typography variant="overline" color="text.secondary">
            Aucun indice débloqué pour l'instant.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default IndiceDisplay;