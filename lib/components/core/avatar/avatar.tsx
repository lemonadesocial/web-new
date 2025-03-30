import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const roundeds = {
  sm: 'rounded-sm',
  rounded: 'rounded',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

interface AvatarProps {
  src?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'rounded' | 'sm' | 'lg';
}

export function Avatar({ src, size = 'md', rounded = 'full', className }: AvatarProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className={twMerge(`relative ${sizes[size]} overflow-hidden ${roundeds[rounded]}`, className)}>
      <div
        className={twMerge(
          'absolute inset-0 w-full h-full bg-card border border-card-border block',
          roundeds[rounded],
          clsx(!isLoading && 'hidden'),
        )}
      ></div>
      <img
        src={src}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-cover"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
