'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SafeImage(props: ImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !props.src) {
    return (
      <div className={cn(
        "flex h-full w-full items-center justify-center bg-muted",
        props.className
      )}>
        <ImageIcon className="h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
