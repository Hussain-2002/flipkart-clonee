
import React, { useState } from 'react';
import { handleImageError } from '@/lib/image-utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export const Image = ({ 
  src, 
  alt, 
  fallback = 'https://via.placeholder.com/400x400?text=Product+Image',
  className = '',
  ...props 
}: ImageProps) => {
  const [error, setError] = useState(false);
  
  return (
    <img
      src={error ? fallback : src}
      alt={alt || 'Product image'}
      className={`${className}`}
      onError={(e) => {
        setError(true);
        e.currentTarget.src = fallback;
      }}
      {...props}
    />
  );
};

export default Image;
