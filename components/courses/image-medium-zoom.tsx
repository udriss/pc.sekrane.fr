import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ImageWithZoomProps {
  src: string;
  alt: string;
}

const ImageWithZoom: React.FC<ImageWithZoomProps> = ({ src, alt }) => {
  return (
    <Zoom>
      <img src={src} alt={alt} style={{ width: '100%', height: 'auto' }} />
    </Zoom>
  );
};

export default ImageWithZoom;