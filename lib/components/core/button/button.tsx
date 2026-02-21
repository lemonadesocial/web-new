import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const sizes: { [key: string]: string } = {
  base: 'px-[12] py-[7] rounded-sm text-md',
  sm: 'px-2.5 py-1.5 rounded-sm text-sm max-h-8',
  lg: 'px-4 py-2 rounded-md text-md md:text-lg max-h-10 md:max-h-11',
  xs: 'px-2 py-1 text-sm rounded-xs',
};

const gaps: { [key: string]: string } = {
  base: 'gap-2.5',
  sm: 'gap-1.5',
  lg: 'gap-3',
  xs: 'gap-1',
};

const btnIconSizes = {
  base: 'p-[10]',
  sm: 'p-[8]',
  lg: 'p-[12] ',
  xs: 'p-[5]',
};

const iconSizeBase = {
  base: 'size-5',
  sm: 'size-4',
  lg: 'size-5',
  xs: 'size-4',
};

interface ButtonProps extends React.PropsWithChildren<HTMLAttributes<HTMLButtonElement>> {
  size?: 'sm' | 'base' | 'lg' | 'xs';
  variant?: 'primary' | 'success' | 'danger' | 'tertiary' | 'tertiary-alt' | 'secondary' | 'flat' | 'warning';
  icon?: string;
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  type?: 'button' | 'submit';
  iconSize?: string;
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
  iconSize,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={twMerge(
        'transition border border-transparent group cursor-pointer inline-flex items-center justify-center font-medium relative',
        sizes[size],
        gaps[size],
        // outlined ? outlineVariants[variant] : variants[variant],
        clsx({ [btnIconSizes[size]]: !!icon, 'cursor-not-allowed opacity-50 ': disabled || loading }),
        clsx('btn', outlined && 'btn-outlined', `btn-${variant}`),
        className,
      )}
      {...rest}
    >
      <svg
        className={twMerge(
          'absolute animate-spin',
          iconSize ? iconSize : iconSizeBase[size],
          clsx({ invisible: !loading }),
        )}
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
      <div className={twMerge('flex justify-center items-center', gaps[size], clsx({ invisible: loading }))}>
        {iconLeft && <i aria-hidden="true" className={twMerge(iconSize ? iconSize : iconSizeBase[size], iconLeft)} />}
        {icon ? <i aria-hidden="true" className={twMerge(iconSize ? iconSize : iconSizeBase[size], icon)} /> : children}
        {iconRight && <i aria-hidden="true" className={twMerge(iconSize ? iconSize : iconSizeBase[size], iconRight)} />}
      </div>
    </button>
  );
}
