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
    <ul className={twMerge('inline-flex bg-tertiary/[.08] rounded-sm', className)}>
      {items.map((item) => (
        <li key={item.value as string} className="flex-1">
          <button
            aria-label={item.value as string}
            onClick={() => {
              setActive(item.value);
              onSelect?.(item);
            }}
            className={clsx(
              'transition cursor-pointer outline-none text-sm font-medium px-2.5 py-1.5 rounded-sm flex-1 w-full',
              {
                'bg-tertiary/[0.08] text-tertiary': active === item.value,
                'text-tertiary/[.56]': active !== item.value,
              },
            )}
          >
            {item.label}
            {item.icon && <i className={item.icon} />}
          </button>
        </li>
      ))}
    </ul>
  );
}
