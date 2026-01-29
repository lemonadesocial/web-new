import React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const chipSizes = {
  s: 'px-2.5 py-1.5 text-sm rounded-sm',
  xs: 'px-2 py-[3px] text-xs rounded-xs',
  xxs: 'px-1.5 py-[1px] text-xs rounded-xs',
}

const iconOnlySizes = {
  s: 'size-7 p-0 rounded-sm',
  xs: 'size-6 p-0 rounded-xs',
  xxs: 'size-5 p-0 rounded-xs',
}

const chipGaps = {
  s: 'gap-1.5',
  xs: 'gap-1',
  xxs: 'gap-1',
}

const iconSizes = {
  s: 'size-4',
  xs: 'size-3.5',
  xxs: 'size-3',
}

const chipVariants = {
  primary: 'bg-accent-400/16 text-accent-400',
  success: 'bg-success-500/16 text-success-500',
  alert: 'bg-blue-400/16 text-blue-400',
  warning: 'bg-warning-300/16 text-warning-300',
  error: 'bg-error/16 text-error',
  secondary: 'bg-primary/8 text-secondary',
}

type ChipProps = {
  children?: React.ReactNode
  className?: string
  size?: 's' | 'xs' | 'xxs'
  variant?: 'primary' | 'success' | 'alert' | 'warning' | 'error' | 'secondary'
  leftIcon?: string
  rightIcon?: string
  icon?: string
}

export function Chip({
  children,
  className,
  size = 's',
  variant = 'primary',
  leftIcon,
  rightIcon,
  icon,
}: ChipProps) {
  const iconOnly = !!icon && !children;

  return (
    <div
      className={twMerge(
        'flex items-center justify-center font-medium select-none transition',
        iconOnly ? iconOnlySizes[size] : chipSizes[size],
        !iconOnly && chipGaps[size],
        chipVariants[variant],
        className
      )}
    >
      {leftIcon && <i className={twMerge(iconSizes[size], leftIcon)} />}
      {iconOnly ? <i className={twMerge(iconSizes[size], icon)} /> : children}
      {rightIcon && <i className={twMerge(iconSizes[size], rightIcon)} />}
    </div>
  )
}
