'use client';

import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  filename?: string;
  onRemove?: () => void;
  className?: string;
  showSizeControl?: boolean;
}

export function ImagePreview({
  src,
  alt,
  filename,
  onRemove,
  className,
  showSizeControl = true
}: ImagePreviewProps) {
  const [imageSize, setImageSize] = useState([60]); // Taille en pourcentage

  const sizePercentage = imageSize[0];
  const maxWidth = Math.min(600, typeof window !== 'undefined' ? window.innerWidth * 0.8 : 600);
  const currentWidth = (maxWidth * sizePercentage) / 100;

  return (
    <div className={cn("border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm font-medium text-gray-700">Aperçu de l&apos;image</span>
          {filename && <p className="text-xs text-gray-500">{filename}</p>}
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      {showSizeControl && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-600">Taille de l&apos;aperçu</label>
            <span className="text-xs text-gray-500">{sizePercentage}%</span>
          </div>
          <Slider
            value={imageSize}
            onValueChange={setImageSize}
            max={100}
            min={20}
            step={5}
            className="w-full"
          />
        </div>
      )}

      <div className="flex justify-center">
        <div 
          className="relative overflow-hidden rounded-lg shadow-md"
          style={{ 
            width: `${currentWidth}px`,
            maxWidth: '100%'
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={currentWidth}
            height={currentWidth * 0.75} // Ratio 4:3 par défaut
            className="object-contain w-full h-auto"
            style={{ 
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  );
}
