import * as React from 'react';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Menu, MenuItem } from '$lib/components/core';

export interface SelectProps {
  value: string;
  onChange: (value: string | undefined) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
  className?: string;
  variant?: 'default' | 'outlined';
  inputSize?: 's' | 'm';
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onChange, options, placeholder, error, className, variant = 'default', inputSize = 'm' }, ref) => {
    const baseClasses = 'w-full rounded-sm focus:outline-none border border-transparent placeholder-quaternary px-2.5 hover:border hover:border-tertiary h-10 flex justify-between items-center gap-1.5 font-medium';

    const triggerClassName = twMerge(
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
        value && 'border border-tertiary',
        error && 'border border-error',
        className
      )
    );

    return (
      <div className="relative w-full" ref={ref}>
        <Menu.Root placement="bottom-start" className="w-full">
          <Menu.Trigger className={triggerClassName}>
            <span className={clsx("truncate flex-1", !value && "text-quaternary")}>
              {value || placeholder}
            </span>
            <i
              className="icon-cancel size-5 text-quaternary cursor-pointer"
              onClick={() => onChange(undefined)}
            />
            <i className="icon-arrow-down size-5 text-quaternary" />
          </Menu.Trigger>

          <Menu.Content className="w-full max-h-60 overflow-auto p-1">
            {({ toggle }) => (
              <>
                {options.map(option => (
                  <MenuItem
                    key={option}
                    title={option}
                    onClick={() => {
                      onChange(option);
                      toggle();
                    }}
                    iconRight={option === value ? <i className="icon-done size-4" /> : undefined}
                  />
                ))}
              </>
            )}
          </Menu.Content>
        </Menu.Root>
      </div>
    );
  }
);

Select.displayName = 'Select';

interface SelectControllerProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: string[];
  placeholder?: string;
  error?: FieldError;
  required?: boolean;
  className?: string;
}

export function SelectController<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  placeholder,
  error,
  required,
  className
}: SelectControllerProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <Select
          value={field.value}
          onChange={field.onChange}
          options={options}
          placeholder={placeholder}
          error={!!error}
          className={className}
        />
      )}
    />
  );
}
