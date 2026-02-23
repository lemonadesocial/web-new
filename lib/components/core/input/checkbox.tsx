'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const iconClassMap = {
  square: {
    checked: 'icon-square-check text-primary',
    unchecked: 'icon-square text-quaternary',
  },
  circle: {
    checked: 'icon-check-filled text-primary',
    unchecked: 'icon-circle-outline text-quaternary',
  },
};

export interface CheckboxProps extends React.PropsWithChildren {
  id: string;
  value?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  containerClass?: string;
  variant?: 'square' | 'circle';
}

export function Checkbox({ id, value = false, onChange, children, containerClass, variant = 'square' }: CheckboxProps) {
  return (
    <div className={twMerge('flex gap-3', containerClass)}>
      <input id={id} name={id} type="checkbox" checked={value} className="peer hidden" onChange={onChange} />
      <label htmlFor={id} className="hidden peer-checked:block cursor-pointer">
        <i aria-hidden="true" className={iconClassMap[variant].checked} />
      </label>
      <label htmlFor={id} className="peer-checked:hidden cursor-pointer">
        <i aria-hidden="true" className={iconClassMap[variant].unchecked} />
      </label>
      {children && (
        <label htmlFor={id} className="cursor-pointer">
          {children}
        </label>
      )}
    </div>
  );
}
