import clsx from 'clsx';
import React from 'react';

interface SegmentItem<T> {
  label: string;
  value: T;
}

interface SegmentProps<T> {
  items: SegmentItem<T>[];
  selected?: T;
  onSelect?: (item: SegmentItem<T>) => void;
}

export default function Segment<T>({ items, selected, onSelect }: SegmentProps<T>) {
  const [active, setActive] = React.useState(selected);

  return (
    <ul className="inline-flex bg-tertiary/[.08] rounded-sm">
      {items.map((item) => (
        <li key={item.value as string}>
          <button
            onClick={() => {
              setActive(item.value);
              onSelect?.(item);
            }}
            className={clsx('transition cursor-pointer outline-none text-sm font-medium px-2.5 py-1.5 rounded-sm', {
              'bg-tertiary/[0.08] text-tertiary': active === item.value,
              'text-tertiary/[.56]': active !== item.value,
            })}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
