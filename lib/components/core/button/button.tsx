import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const sizes: { [key: string]: string } = {
  base: 'px-[12] py-[7] rounded-md text-md ',
  sm: 'px-2.5 py-1.5 rounded-sm text-sm',
  lg: 'px-4 py-2 rounded-md text-lg',
};

const iconOnlySizes = {
  base: 'p-[10]',
  sm: 'p-[8]',
  lg: 'p-[12] ',
};

const variants: { [key: string]: string } = {
  primary: 'bg-primary-500 hover:bg-primary-500/[0.8]',
  success: 'bg-success-600 hover:bg-success-600/[0.8]',
  tertiary: 'bg-tertiary/[.08] hover:bg-tertiary/[.16]',
  secondary: 'bg-tertiary hover:bg-tertiary/[0.8] text-black',
};

interface ButtonProps extends React.PropsWithChildren<HTMLAttributes<HTMLButtonElement>> {
  size?: 'sm' | 'base' | 'lg';
  variant?: 'primary' | 'success' | 'tertiary' | 'secondary';
  icon?: string;
  iconLeft?: string;
  iconRight?: string;
}

export function Button({
  children,
  className,
  size = 'base',
  variant = 'primary',
  icon,
  iconLeft,
  iconRight,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        'transition cursor-pointer inline-flex items-center justify-center gap-2.5 font-medium',
        sizes[size],
        variants[variant],
        clsx({ [iconOnlySizes[size]]: !!icon }),
        className,
      )}
      {...rest}
    >
      {iconLeft && <i className={twMerge('size-[18]', iconLeft)} />}
      {icon ? <i className={twMerge('size-[18]', icon)} /> : children}
      {iconRight && <i className={twMerge('size-[18]', iconRight)} />}
    </button>
  );
}
