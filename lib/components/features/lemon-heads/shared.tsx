import React from 'react';
import { twMerge } from 'tailwind-merge';

export function SquareButton({
  className,
  active = false,
  onClick,
  children,
}: React.PropsWithChildren & {
  className?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        'border cursor-pointer rounded-md aspect-square flex justify-center items-center hover:border-quaternary',
        className,
        active && 'border-primary!',
      )}
    >
      {children}
    </div>
  );
}
