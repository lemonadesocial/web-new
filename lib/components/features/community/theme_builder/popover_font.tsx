import clsx from 'clsx';
import { join, split } from 'lodash';
import { Menu } from '$lib/components/core';

interface Props {
  label: string;
  fonts: Record<string, string>;
  selected: string;
  onSelect: (font: string) => void;
}

export function PopoverFont({ label, fonts, selected, onSelect }: Props) {
  return (
    <Menu.Root placement="top" strategy="fixed" className="max-w-1/3 min-w-1/3">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <h3
            style={{ fontFamily: fonts[selected] }}
            className={clsx(label === 'title' ? 'font-semibold' : 'font-medium')}
          >
            Ag
          </h3>
          <span className={clsx('flex-1 capitalize')}>{label}</span>
          <p className="flex items-center gap-1 font-general-sans">
            <span className="capitalize">
              {Object.keys(fonts)
                .find((key) => key === selected)
                ?.replaceAll('_', ' ')}
            </span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <Menu.Content className="max-h-80 w-[370px] overflow-scroll no-scrollbar">
        <div className="flex gap-4 flex-wrap">
          {Object.entries(fonts).map(([key, font]) => (
            <div
              key={key}
              className="flex flex-col items-center text-xs gap-2 cursor-pointer"
              onClick={() => onSelect(key)}
            >
              <div
                className={clsx(
                  'border rounded px-4 py-2 w-[72px] h-[56px]',
                  key === selected.toLowerCase().replaceAll(' ', '_') && 'border border-primary',
                )}
              >
                <h3 style={{ fontFamily: font }} className="size-10 text-xl text-center">
                  Ag
                </h3>
              </div>
              <p className="capitalize font-general-sans">{join(split(key, '_'), ' ')}</p>
            </div>
          ))}
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}
