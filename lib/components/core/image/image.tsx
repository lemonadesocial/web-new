import React from 'react';
import { Skeleton } from '../skeleton';

type Props = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
};
export function Image({ src, alt, width, height, className, lazy = false }: Props) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = () => {
    if (lazy) setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`image-container ${className}`} style={{ width, height }}>
      {!imageLoaded && !imageError && <Skeleton className="w-full h-full" animate />}

      {imageError && (
        <div className="flex items-center justify-center w-full h-full">
          <span>Error loading image</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded ? 'block' : 'none', width: '100%', height: '100%' }}
      />
    </div>
  );
}
