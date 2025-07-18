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

  const finalClassName = twMerge(
    clsx(
      baseClasses,
      {
        'bg-primary/8': variant === 'default',
        'bg-background/64 border-primary/8 hover:border-primary focus:border-primary': variant === 'outlined',
      },
      {
        'text-sm': inputSize === 's',
        'text-base': inputSize === 'm',
      },
      error && 'border border-error',
      className
    )
  );

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
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
  className?: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({ label, required, children, className }) => {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
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
