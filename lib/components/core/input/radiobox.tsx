'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Radiobox({
  id,
  name,
  value = false,
  onChange,
  children,
  containerClass,
}: React.PropsWithChildren & {
  id: string;
  name: string;
  value?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerClass?: string;
}) {
  return (
    <div className={twMerge('flex gap-3', containerClass)}>
      <input id={id} name={name} type="radio" checked={value} className="peer hidden" onChange={onChange} />
      <label htmlFor={id} className="hidden peer-checked:block cursor-pointer">
        <i className="icon-check" />
      </label>
      <label htmlFor={id} className="peer-checked:hidden cursor-pointer">
        <i className="icon-circle-outline" />
      </label>
      <label htmlFor={id} className="cursor-pointer w-full">
        {children}
      </label>
    </div>
  );
}
