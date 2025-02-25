import clsx from 'clsx';
import React from 'react';

interface SegmentItem {
  label: string;
  value: string | number;
}

interface SegmentProps {
  items: SegmentItem[];
  selected?: string | number;
  onSelect?: (item: SegmentItem) => void;
}

export default function Segment({ items, selected, onSelect }: SegmentProps) {
  const [active, setActive] = React.useState(() => selected);

  return (
    <ul className="inline-flex bg-tertiary/[.08] rounded-sm">
      {items.map((item) => (
        <li key={item.value}>
          <button
            onClick={() => {
              setActive(item.value);
              onSelect?.(item);
            }}
            className={clsx('cursor-pointer text-sm font-medium px-2.5 py-1.5 rounded-sm', {
              'bg-tertiary/[.08] text-tertiary': active === item.value,
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
