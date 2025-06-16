'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Checkbox({
  id,
  value = false,
  onChange,
  children,
  containerClass,
}: React.PropsWithChildren & { id: string; value?: boolean; onChange?: () => void; containerClass?: string }) {
  return (
    <div className={twMerge('flex gap-3', containerClass)}>
      <input id={id} name={id} type="checkbox" checked={value} className="peer hidden" onChange={onChange} />
      <label htmlFor={id} className="hidden peer-checked:block cursor-pointer">
        <i className="icon-square-check text-primary" />
      </label>
      <label htmlFor={id} className="peer-checked:hidden cursor-pointer">
        <i className="icon-square text-quaternary" />
      </label>
      <label htmlFor={id} className="cursor-pointer">
        {children}
      </label>
    </div>
  );
}
