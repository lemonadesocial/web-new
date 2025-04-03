import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MenuItemProps {
  title: string;
  onClick?: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function MenuItem({ iconLeft, iconRight, title, onClick }: MenuItemProps) {
  return (
    <div
      className={clsx(
        'inline-flex gap-2.5 px-2 py-1.5 items-center w-full rounded-xs cursor-pointer',
        typeof onClick === 'function' && 'hover:bg-primary/8',
      )}
      onClick={onClick}
    >
      {iconLeft && (
        typeof iconLeft === 'string' ? (
          <i className={twMerge(iconLeft, 'text-tertiary size-4')} />
        ) : (
          iconLeft
        )
      )}
      <p className="font-medium text-sm font-default-body flex-1">{title}</p>
      {iconRight && (
        typeof iconRight === 'string' ? (
          <i className={twMerge(iconRight, 'text-tertiary size-4')} />
        ) : (
          iconRight
        )
      )}
    </div>
  );
}
