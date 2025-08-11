import clsx from 'clsx';
import React from 'react';

export function Toggle({
  id,
  checked = false,
  onChange,
  disabled = false,
}: {
  id: string;
  checked?: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => {
          if (!disabled) {
            onChange(e.target.checked);
          }
        }}
      />
      <label htmlFor={id} className="hidden"></label>
      <div
        className={clsx(
          "peer h-6 w-11 rounded-full border bg-quaternary after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-success-700 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300",
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      ></div>
    </label>
  );
}
