import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface AlertProps extends PropsWithChildren {
  message: string;
  variant?: 'primary';
}

const classes = {
  base: 'flex gap-4 items-center justify-center p-4',
  variants: {
    primary: { fg: 'text-primary-400', bg: 'bg-primary-400/16' },
  },
};

export function Alert({ message, variant = 'primary', children }: AlertProps) {
  return (
    <div className={twMerge(classes.base, classes.variants[variant].bg)}>
      <span className={twMerge('flex-1 font-medium', classes.variants[variant].fg)}>{message}</span>
      {children}
    </div>
  );
}
