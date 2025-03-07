import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SpacerProps {
  direction?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const spacerClasses = {
  vertical: {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-8',
    xl: 'h-12',
  },
  horizontal: {
    sm: 'w-2',
    md: 'w-4',
    lg: 'w-8',
    xl: 'w-12',
  },
};

export function Spacer({ direction = 'vertical', size = 'md', className }: SpacerProps) {
  const baseClassName = `${spacerClasses[direction][size]}`;
  return <div className={twMerge(baseClassName, className)}></div>;
}
