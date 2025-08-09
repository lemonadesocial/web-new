'use client';
import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
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

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'outlined';
  inputSize?: 's' | 'm';
  error?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'default',
  inputSize = 'm',
  value,
  onChange,
  placeholder,
  className,
  error,
  rows = 3,
  ...props
}, ref) => {
  const baseClasses = 'w-full rounded-sm focus:outline-none placeholder-quaternary px-2.5 py-2 font-medium resize-none no-scrollbar';

  const finalClassName = twMerge(
    clsx(
      baseClasses,
      {
        'bg-primary/8': variant === 'default',
        'bg-background/64 border border-primary/8 hover:border-primary focus:border-primary': variant === 'outlined',
      },
      {
        'text-sm': inputSize === 's',
        'text-base': inputSize === 'm',
      },
      error && 'border border-error',
      className
    )
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <textarea
      ref={(node) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        adjustHeight();
      }}
      placeholder={placeholder}
      rows={rows}
      className={finalClassName}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

interface LabeledInputProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({ label, required, children, className }) => {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <p className="font-medium text-sm text-secondary">
        {label}
        {required && <span>{' '}*</span>}
      </p>
      {children}
    </div>
  );
};

export function ErrorText({ message }: { message: string }) {
  return <p className="text-sm text-error">{message}</p>;
}
