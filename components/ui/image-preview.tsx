'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Slider as MuiSlider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  filename?: string;
  onRemove?: () => void;
  className?: string;
  showSizeControl?: boolean;
  initialImageSize?: number;
  onImageSizeChange?: (size: number) => void;
}

export function ImagePreview({
  src,
  alt,
  filename,
  onRemove,
  className,
  showSizeControl = true,
  initialImageSize = 60,
  onImageSizeChange
}: ImagePreviewProps) {
  const [imageSize, setImageSize] = useState(initialImageSize);

  // Sync with external value changes
  useEffect(() => {
    setImageSize(initialImageSize);
  }, [initialImageSize]);

  const handleSizeChange = (_event: Event, newValue: number | number[]) => {
    const size = Array.isArray(newValue) ? newValue[0] : newValue;
    setImageSize(size);
    if (onImageSizeChange) {
      onImageSizeChange(size);
    }
  };

  const maxWidth = Math.min(600, typeof window !== 'undefined' ? window.innerWidth * 0.8 : 600);
  const currentWidth = (maxWidth * imageSize) / 100;

  return (
    <Box 
      className={className}
      sx={{ 
        border: '2px dashed', 
        borderColor: 'grey.300', 
        borderRadius: 2, 
        p: 2, 
        bgcolor: 'grey.50' 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Aperçu de l&apos;image
          </Typography>
          {filename && (
            <Typography variant="caption" color="text.secondary">
              {filename}
            </Typography>
          )}
        </Box>
        {onRemove && (
          <IconButton
            onClick={onRemove}
            size="small"
            sx={{ 
              bgcolor: 'background.paper',
              '&:hover': { 
                bgcolor: 'error.light',
                '& .MuiSvgIcon-root': { color: 'error.contrastText' }
              } 
            }}
          >
            <CloseIcon sx={{ fontSize: 16, color: 'error.main' }} />
          </IconButton>
        )}
      </Box>

      {showSizeControl && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              Taille de l&apos;aperçu
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {imageSize}%
            </Typography>
          </Box>
          <MuiSlider
            value={imageSize}
            onChange={handleSizeChange}
            min={20}
            max={100}
            step={5}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box 
          sx={{ 
            position: 'relative', 
            overflow: 'hidden', 
            borderRadius: 2, 
            boxShadow: 2,
            width: `${currentWidth}px`,
            maxWidth: '100%'
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={currentWidth}
            height={currentWidth * 0.75} // Ratio 4:3 par défaut
            style={{ 
              objectFit: 'contain',
              width: '100%',
              height: 'auto',
              maxWidth: '100%'
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
