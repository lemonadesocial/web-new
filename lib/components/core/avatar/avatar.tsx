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
  return (
    <div className={twMerge(`relative ${sizes[size]} overflow-hidden ${roundeds[rounded]}`, className)}>
      <img
        src={src || `${process.env.ASSET_PREFIX}/assets/images/avatars/lemonade_davatar_2.png`}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
