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
      className="inline-flex gap-2.5 px-2 py-1.5 items-center w-full hover:bg-primary/8 rounded-xs cursor-pointer"
      onClick={onClick}
    >
      {iconLeft && <i className={twMerge(iconLeft, 'text-tertiary size-4')} />}
      <p className="font-medium text-sm font-default-body">{title}</p>
    </div>
  );
}
