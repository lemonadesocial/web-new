import React from 'react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const roundeds = {
  sm: 'rounded-sm',
  rounded: 'rounded',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

interface AvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'rounded' | 'sm' | 'lg';
}

export function Avatar({ src, size = 'md', rounded = 'full' }: AvatarProps) {
  return (
    <div className={twMerge(`relative ${sizes[size]} overflow-hidden ${roundeds[rounded]}`)}>
      <img
        src={src || 'https://assets.lemonade.social/assets/images/avatars/lemonade_davatar_1.png'}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
