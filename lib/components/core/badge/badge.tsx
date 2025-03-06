import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Badge({ color, title, className }: { title: string; color?: string; className?: string }) {
  return (
    <div
      className={twMerge('text-xs py-1 px-2 w-fit rounded-xs font-medium', className)}
      style={{ backgroundColor: `rgb(from ${color} r g b / 0.16)`, color }}
    >
      {title}
    </div>
  );
}
