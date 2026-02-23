import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MenuItemProps {
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function MenuItem({ iconLeft, iconRight, title, onClick, children, className }: MenuItemProps) {
  return (
    <div
      className={clsx(
        'inline-flex gap-2.5 px-2 py-1.5 items-center min-w-full rounded-xs cursor-pointer text-nowrap max-w-3xs',
        className,
        typeof onClick === 'function' && 'hover:bg-primary/8',
      )}
      onClick={onClick}
    >
      {iconLeft &&
        (typeof iconLeft === 'string' ? <i aria-hidden="true" className={twMerge('text-tertiary size-4', iconLeft)} /> : iconLeft)}
      {title && <p className="font-medium text-sm font-default-body text-secondary flex-1">{title}</p>}
      {children}
      {iconRight &&
        (typeof iconRight === 'string' ? <i aria-hidden="true" className={twMerge(iconRight, 'text-tertiary size-4')} /> : iconRight)}
    </div>
  );
}
