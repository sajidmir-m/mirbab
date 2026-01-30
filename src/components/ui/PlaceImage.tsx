'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PlaceImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function PlaceImage({ src, alt, fill = true, className = '', priority = false, sizes }: PlaceImageProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  if (imgError || !imgSrc) {
    return null; // Return null if image fails, let the gradient show
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      unoptimized={true}
      priority={priority}
      sizes={sizes}
      onError={() => {
        console.error(`Failed to load image: ${imgSrc}`);
        setImgError(true);
      }}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          console.error(`Image loaded but has 0 width: ${imgSrc}`);
          setImgError(true);
        }
      }}
    />
  );
}

