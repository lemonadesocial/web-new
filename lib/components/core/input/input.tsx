import React, { ChangeEvent } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps {
  variant?: 'default' | 'outlined';
  size?: 's' | 'm';
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'm',
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
}) => {
  const baseClasses = 'w-full rounded-sm focus:outline-none border border-transparent placeholder-quaternary px-2.5 hover:border hover:border-tertiary h-10';

  const finalClassName = twMerge(
    clsx(
      baseClasses,
      {
        'bg-primary/8': variant === 'default',
        '': variant === 'outlined', // TODO
      },
      {
        'text-sm': size === 's',
        'text-base': size === 'm',
      },
      value && 'border border-tertiary',
      className
    )
  );

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={finalClassName}
    />
  );
};
