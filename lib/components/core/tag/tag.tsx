import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TagProps extends React.PropsWithChildren {
  variant?: 'primary' | 'success' | 'danger';
  onClick?: () => void;
  className?: string;
}

export function Tag({ children, onClick, className }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'transition cursor-pointer py-1 px-4 w-fit border rounded-lg font-medium inline-flex gap-1',
        className,
      )}
    >
      {children}
    </button>
  );
}
