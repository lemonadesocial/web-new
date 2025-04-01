import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MenuItemProps {
  iconLeft?: string;
  title: string;
  onClick?: () => void;
}

export function MenuItem({ iconLeft, title, onClick }: MenuItemProps) {
  return (
    <div
      className={clsx(
        'inline-flex gap-2.5 px-2 py-1.5 items-center w-full rounded-xs cursor-pointer',
        typeof onClick === 'function' && 'hover:bg-primary/8',
      )}
      onClick={onClick}
    >
      {iconLeft && <i className={twMerge(iconLeft, 'text-tertiary size-4')} />}
      <p className="font-medium text-sm font-default-body">{title}</p>
    </div>
  );
}
