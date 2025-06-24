import React from 'react';
import { twMerge } from 'tailwind-merge';

export function SquareButton({
  className,
  active = false,
  onClick,
  children,
  style,
}: React.PropsWithChildren & {
  className?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={style}
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
