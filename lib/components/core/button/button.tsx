import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const sizes: { [key: string]: string } = {
  base: 'px-[12] py-[7] rounded-sm text-md',
  sm: 'px-2.5 py-1.5 rounded-sm text-sm',
  lg: 'px-4 py-2 rounded-md text-lg',
  xs: 'px-2 py-1 text-sm rounded-xs',
};

const iconOnlySizes = {
  base: 'p-[10]',
  sm: 'p-[8]',
  lg: 'p-[12] ',
  xs: 'p-[5]',
};

const variants: { [key: string]: string } = {
  primary: 'bg-accent-500 hover:bg-accent-700',
  success: 'bg-success-600 hover:bg-success-600/8',
  danger: 'bg-danger-500 hover:bg-danger-500/8',
  tertiary: 'bg-primary/8 hover:bg-primary/16 text-tertiary',
  'tertiary-alt':
    'bg-primary/8 hover:bg-primary/80 text-tertiary hover:text-black disabled:opacity-50 disabled:hover:bg-primary/8 disabled:hover:text-tertiary',
  secondary: 'bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-black',
  flat: 'hover:bg-primary/[0.08]',
};

const outlineVariants: { [key: string]: string } = {
  primary: 'border-accent-500 hover:bg-accent-500/[0.1] text-accent-500',
  success: 'border-success-600 hover:bg-success-600/[0.1] text-success-600',
  tertiary: 'border-primary/[0.8] hover:bg-primary/[.1] text-tertiary',
  secondary: 'border-primary hover:bg-primary/[0.1] text-black',
  flat: 'border-primary/[0.1] hover:bg-primary/[0.08] text-tertiary',
};

interface ButtonProps extends React.PropsWithChildren<HTMLAttributes<HTMLButtonElement>> {
  size?: 'sm' | 'base' | 'lg' | 'xs';
  variant?: 'primary' | 'success' | 'danger' | 'tertiary' | 'tertiary-alt' | 'secondary' | 'flat';
  icon?: string;
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  className,
  size = 'base',
  variant = 'primary',
  icon,
  iconLeft,
  iconRight,
  loading,
  disabled,
  outlined,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={twMerge(
        'transition border border-transparent group cursor-pointer inline-flex items-center justify-center gap-2.5 font-medium',
        sizes[size],
        outlined ? outlineVariants[variant] : variants[variant],
        clsx({ [iconOnlySizes[size]]: !!icon, 'cursor-not-allowed opacity-50 ': disabled || loading }),
        className,
      )}
      {...rest}
    >
      <svg
        className={twMerge('absolute size-5 animate-spin', clsx({ invisible: !loading }))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <div className={twMerge('flex justify-center items-center gap-2.5', clsx({ invisible: loading }))}>
        {iconLeft && <i className={twMerge('size-[18]', iconLeft)} />}
        {icon ? <i className={twMerge('size-[18]', icon)} /> : children}
        {iconRight && <i className={twMerge('size-[18]', iconRight)} />}
      </div>
    </button>
  );
}
