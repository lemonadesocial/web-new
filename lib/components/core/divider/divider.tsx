import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const defaultOrientation = 'horizontal';

export function Divider({ orientation = defaultOrientation, className }: DividerProps) {
  return <div className={twMerge('border-b ', clsx({ 'border-b-0 b-r': orientation === 'vertical' }), className)} />;
}
