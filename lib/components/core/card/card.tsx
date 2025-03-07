import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        'p-4 rounded-md border border-tertiary/[0.04] bg-tertiary/[0.04] hover:bg-tertiary/[.08]',
        className,
      )}
    >
      {children}
    </div>
  );
}
