import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface AlertProps extends PropsWithChildren {
  message?: string;
  variant?: 'primary';
  className?: string;
}

const classes = {
  base: 'flex gap-4 items-center justify-center p-4',
  variants: {
    primary: { fg: 'text-accent-400', bg: 'bg-accent-400/16' },
  },
};

export function Alert({ message, variant = 'primary', children, className }: AlertProps) {
  return (
    <div className={twMerge(classes.base, classes.variants[variant].bg, className)}>
      {message && <span className={twMerge('flex-1 font-medium', classes.variants[variant].fg)}>{message}</span>}
      {children}
    </div>
  );
}
