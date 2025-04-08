import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../button';

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
  size?: 'base' | 'sm' | 'lg' | 'xs';
}

export function Segment<T>({ items, selected, size, onSelect, className }: SegmentProps<T>) {
  const [active, setActive] = React.useState(selected);

  return (
    <ul className={twMerge('inline-flex bg-primary/8 rounded-sm', className)}>
      {items.map((item) => (
        <li key={item.value as string} className="flex-1">
          <Button
            className={clsx(
              'w-full hover:bg-initial text-primary backdrop-blur-none',
              active !== item.value && 'hover:bg-transparent text-tertiary hover:text-primary',
            )}
            variant={active === item.value ? 'tertiary' : 'flat'}
            icon={item.icon}
            size={size}
            onClick={() => {
              setActive(item.value);
              onSelect?.(item);
            }}
          >
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}
