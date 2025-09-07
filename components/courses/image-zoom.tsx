import React, { useState, MouseEvent } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt }) => {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handleZoom = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
    setZoom(!zoom);
  };

  return (
    <div
      style={{
        cursor: zoom ? 'zoom-out' : 'zoom-in',
        overflow: zoom ? 'auto' : 'hidden',
        maxHeight: '100%',
        position: 'relative'
      }}
      onClick={handleZoom}
    >
            <Image
        src={src}
        alt={alt || 'Zoomable'}
        fill
        style={{
          objectFit: 'contain',
          transform: zoom ? 'scale(2)' : 'scale(1)',
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transition: 'transform 0.3s ease'
        }}
      />
    </div>
  );
};

export default ImageZoom;