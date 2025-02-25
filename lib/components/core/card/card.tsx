import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.PropsWithChildren {
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div className={twMerge('p-4 rounded-md border border-tertiary/[0.04] bg-tertiary/[0.04]', className)}>
      {children}
    </div>
  );
}

export default Card;
