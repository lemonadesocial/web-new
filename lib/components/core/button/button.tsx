import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const sizes: { [key: string]: string } = {
  base: 'px-[12] py-[7] rounded-sm text-md ',
  sm: 'px-2.5 py-1.5 rounded-sm text-sm',
  lg: 'px-4 py-2 rounded-md text-lg',
  xs: 'px-2 py-1 text-sm',
};

const iconOnlySizes = {
  base: 'p-[10]',
  sm: 'p-[8]',
  lg: 'p-[12] ',
  xs: 'p-[5]',
};

const variants: { [key: string]: string } = {
  primary: 'bg-primary-500 hover:bg-primary-500/8',
  success: 'bg-success-600 hover:bg-success-600/8',
  tertiary: 'bg-tertiary/8 hover:bg-tertiary/16 text-tertiary/56',
  'tertiary-alt': 'bg-tertiary/8 hover:bg-tertiary/80 text-tertiary/56 hover:text-black',
  secondary: 'bg-tertiary hover:bg-tertiary/8 text-black',
  flat: 'hover:bg-tertiary/[0.08]',
};

const outlineVariants: { [key: string]: string } = {
  primary: 'border-primary-500 hover:bg-primary-500/[0.1] text-primary-500',
  success: 'border-success-600 hover:bg-success-600/[0.1] text-success-600',
  tertiary: 'border-tertiary/[0.8] hover:bg-tertiary/[.1] text-tertiary',
  secondary: 'border-tertiary hover:bg-tertiary/[0.1] text-black',
  flat: 'border-tertiary/[0.1] hover:bg-tertiary/[0.08] text-tertiary',
};

interface ButtonProps extends React.PropsWithChildren<HTMLAttributes<HTMLButtonElement>> {
  size?: 'sm' | 'base' | 'lg' | 'xs';
  variant?: 'primary' | 'success' | 'tertiary' | 'tertiary-alt' | 'secondary' | 'flat';
  icon?: string;
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
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
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
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
