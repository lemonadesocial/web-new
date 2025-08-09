import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export function Badge({
  color,
  title,
  className,
  onClose,
  children,
}: PropsWithChildren & {
  title?: string;
  color?: string;
  className?: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div
      className={twMerge('text-xs py-1 px-2 w-fit flex items-center gap-1 rounded-xs font-medium', className)}
      style={{ backgroundColor: `rgb(from ${color} r g b / 0.16)`, color }}
    >
      {children || <p className="truncate">{title}</p>}
      {typeof onClose === 'function' && (
        <button onClick={onClose} className="flex items-center cursor-pointer">
          <i className="icon-x size-[14]" />
        </button>
      )}
    </div>
  );
}
