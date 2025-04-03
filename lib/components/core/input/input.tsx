'use client';
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outlined';
  inputSize?: 's' | 'm';
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  inputSize = 'm',
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  error,
  ...props
}, ref) => {
  const baseClasses = 'w-full rounded-sm focus:outline-none border border-transparent placeholder-quaternary px-2.5 hover:border hover:border-tertiary h-10 font-medium';

  const [inputValue, setInputValue] = React.useState(value);

  const finalClassName = twMerge(
    clsx(
      baseClasses,
      {
        'bg-primary/8': variant === 'default',
        '': variant === 'outlined', // TODO
      },
      {
        'text-sm': inputSize === 's',
        'text-base': inputSize === 'm',
      },
      inputValue && 'border border-tertiary',
      error && 'border border-error',
      className
    )
  );

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={e => {
        onChange?.(e);
        setInputValue(e.target.value);
      }}
      placeholder={placeholder}
      className={finalClassName}
      {...props}
    />
  );
});

Input.displayName = 'Input';

interface LabeledInputProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({ label, required, children }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-medium text-sm text-secondary">
        {label}
        {required && <span>{' '}*</span>}
      </label>
      {children}
    </div>
  );
};

export function ErrorText({ message }: { message: string }) {
  return <p className="text-sm text-error">{message}</p>;
}
