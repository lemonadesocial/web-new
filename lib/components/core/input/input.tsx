import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
}

export function Input({
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder,
  leftIcon,
  rightIcon,
  className,
}: InputProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={label} className="text-tertiary text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={leftIcon} />
          </div>
        )}
        <input
          type={type}
          id={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={twMerge(
            'transition w-full border font-medium rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500',
            clsx({
              'pl-11': !!leftIcon,
              'pr-11': !!rightIcon,
            }),
          )}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className={rightIcon} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
