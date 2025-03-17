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
      className="inline-flex gap-2.5 p-1.5 items-center w-full hover:bg-tertiary/16 rounded-sm cursor-pointer"
      onClick={onClick}
    >
      {iconLeft && <i className={twMerge(iconLeft, 'text-tertiary/56 size-4')} />}
      <p className="font-medium text-sm">{title}</p>
    </div>
  );
}
