import { Menu } from '$lib/components/core';
import clsx from 'clsx';
import { patterns } from './store';
import { twMerge } from 'tailwind-merge';

interface Props {
  label: string;
  colorClass?: string;
  selected?: string;
  disabled?: boolean;
  onSelect: (color: string, hex?: string) => void;
}

export function PopoverPattern({ selected, colorClass, onSelect }: Props) {
  return (
    <Menu.Root strategy="fixed" placement="top" className="flex-1">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <div className="w-[24px] h-[24px] rounded-full">
            <div className={clsx(`pattern rounded-full w-full h-full relative!`, colorClass, selected)} />
          </div>
          <span className="text-left flex-1">Pattern</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{selected}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <Menu.Content className="flex gap-3 max-w-[356px] flex-wrap">
        {patterns.map((item) => (
          <div
            key={item}
            className="capitalize flex flex-col items-center cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div
              className={clsx(
                'w-16! h-16! rounded-full p-1 border-2 border-transparent mb-1 overflow-hidden',
                selected === item && 'border-white',
              )}
            >
              <div className={twMerge('pattern rounded-full item-pattern relative! w-full h-full', colorClass, item)} />
            </div>
            {item}
          </div>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}
