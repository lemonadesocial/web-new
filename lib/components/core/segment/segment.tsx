import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SegmentItem<T> {
  label?: string;
  value: T;
  icon?: string;
}

interface SegmentProps<T> {
  items: SegmentItem<T>[];
  selected?: T;
  onSelect?: (item: SegmentItem<T>) => void;
  className?: string;
}

export function Segment<T>({ items, selected, onSelect, className }: SegmentProps<T>) {
  const [active, setActive] = React.useState(selected);

  return (
    <ul className={twMerge('inline-flex bg-primary/8 rounded-sm', className)}>
      {items.map((item) => (
        <li key={item.value as string} className="flex-1">
          <button
            aria-label={item.value as string}
            onClick={() => {
              setActive(item.value);
              onSelect?.(item);
            }}
            className={clsx(
              'flex items-center justify-center transition cursor-pointer outline-none text-sm font-medium p-2 rounded-sm flex-1 w-full',
              {
                'bg-primary/8 text-tertiary': active === item.value,
                'text-tertiary': active !== item.value,
              },
            )}
          >
            {item.label}
            {item.icon && <i className={twMerge(item.icon, 'size-4')} />}
          </button>
        </li>
      ))}
    </ul>
  );
}
