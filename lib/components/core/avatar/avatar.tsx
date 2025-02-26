import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <div
      className={twMerge(
        `relative size-${size} rounded-full overflow-hidden bg-tertiary/[0.4] flex items-center justify-center`,
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name || initials} className="w-full h-full object-cover" />
      ) : (
        <span className={twMerge(`text-${size / 2} font-medium`, className)}>{initials}</span>
      )}
    </div>
  );
}
