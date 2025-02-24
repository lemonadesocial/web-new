import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const sizes: { [key: string]: string } = {
  base: 'px-[12] py-[7] rounded-xl',
  sm: 'px-[10] py-[6] rounded-lg',
  lg: 'px-[16] py-[8] rounded-xl',
};

const variants: { [key: string]: string } = {
  primary: 'bg-primary-500 hover:bg-primary-500/8',
};

interface ButtonProps extends React.PropsWithChildren<HTMLAttributes<HTMLButtonElement>> {
  size?: 'sm' | 'base' | 'lg';
  variant?: 'primary';
}

export default function Button({ children, className, size = 'base', variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button className={twMerge(sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
