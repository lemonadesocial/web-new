import * as React from 'react';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

import { Menu, MenuItem } from '$lib/components/core';

export interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
  className?: string;
  variant?: 'default' | 'outlined';
  inputSize?: 's' | 'm';
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ value = [], onChange, options, placeholder, error, className, variant = 'default', inputSize = 'm' }, ref) => {
    const baseClasses = 'w-full rounded-sm focus:outline-none border border-transparent placeholder-quaternary px-2.5 hover:border hover:border-tertiary h-10 flex justify-between items-center gap-1.5';

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
        value?.length > 0 && 'border border-tertiary',
        error && 'border border-error',
        className
      )
    );

    const handleToggleOption = (option: string) => {
      if (value?.includes(option)) {
        onChange(value.filter(item => item !== option));
      } else {
        onChange([...(value || []), option]);
      }
    };

    const handleRemoveItem = (e: React.MouseEvent, item: string) => {
      e.stopPropagation();
      onChange(value.filter(val => val !== item));
    };

    return (
      <div className="relative w-full" ref={ref}>
        <Menu.Root placement="bottom-start" className="w-full">
          <Menu.Trigger className={triggerClassName}>
            <div className="truncate flex-1 flex flex-wrap gap-1">
              {value?.length > 0 ? (
                value.map(item => (
                  <span key={item} className="bg-primary/8 px-2 py-0.5 rounded text-sm flex items-center gap-1.5">
                    {item}
                    <i
                      className="icon-x size-5 text-quaternary cursor-pointer"
                      onClick={(e) => handleRemoveItem(e, item)}
                    />
                  </span>
                ))
              ) : (
                <span className="text-quaternary">{placeholder}</span>
              )}
            </div>
            <i className="icon-arrow-down size-5 text-quaternary" />
          </Menu.Trigger>

          <Menu.Content className="w-full max-h-60 overflow-auto p-1">
            {options.map(option => (
              <MenuItem
                key={option}
                title={option}
                onClick={() => handleToggleOption(option)}
                iconRight={value?.includes(option) ? <i className="icon-done size-4" /> : undefined}
              />
            ))}
          </Menu.Content>
        </Menu.Root>
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

interface MultiSelectControllerProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: string[];
  placeholder?: string;
  error?: FieldError;
  required?: boolean;
  className?: string;
}

export function MultiSelectController<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  placeholder,
  error,
  required,
  className
}: MultiSelectControllerProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <MultiSelect
          value={field.value || []}
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
