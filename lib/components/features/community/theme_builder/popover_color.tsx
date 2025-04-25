import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ColorPicker } from '$lib/components/core/color-picker';
import { Menu } from '$lib/components/core';

import { colors, shaders } from './store';

interface Props {
  label: string;
  colorClass?: string;
  selected?: string;
  disabled?: boolean;
  onSelect: (color: string, hex?: string) => void;
}

export function PopoverColor({ label, selected = 'violet', colorClass, onSelect, disabled }: Props) {
  return (
    <Menu.Root placement="top" strategy="fixed" className="max-w-1/3 min-w-1/3" disabled={disabled}>
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <i className={twMerge('size-[24px] rounded-full', colorClass, selected)} />

          <span className="text-left flex-1  font-general-sans">{label}</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{selected}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <Menu.Content>
        <div className="grid grid-cols-9 gap-2.5">
          {colors.map((c) => (
            <div
              key={c}
              onClick={() => {
                onSelect(c);
              }}
              className={twMerge(
                'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                `${c} ${colorClass}`,
                clsx(c === selected && 'outline-2'),
              )}
            />
          ))}

          <ColorPicker.Root>
            <ColorPicker.Trigger>
              <div
                className={twMerge(
                  'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                  `custom ${colorClass}`,
                  clsx(selected === 'custom' && 'outline-2'),
                )}
                style={{
                  background:
                    'conic-gradient(from 180deg at 50% 50%, rgb(222, 97, 134) 0deg, rgb(197, 95, 205) 58.12deg, rgb(175, 145, 246) 114.38deg, rgb(53, 130, 245) 168.75deg, rgb(69, 194, 121) 208.13deg, rgb(243, 209, 90) 243.75deg, rgb(247, 145, 62) 285deg, rgb(244, 87, 95) 360deg)',
                }}
              ></div>
            </ColorPicker.Trigger>
            <ColorPicker.Content color={'#fff'} onChange={(result) => onSelect('custom', result.hex)} />
          </ColorPicker.Root>
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}

type PopoverShaderColorProps = {
  label: string;
  selected?: string;
  onSelect: (shader: { name: string; accent: string }) => void;
};

export function PopoverShaderColor({ label, selected, onSelect }: PopoverShaderColorProps) {
  return (
    <Menu.Root placement="top" strategy="fixed" className="max-w-1/3 min-w-1/3">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <div
            className={twMerge(
              'size-[24px] cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
              `item-color-${selected}`,
            )}
          />

          <span className="text-left flex-1  font-general-sans">{label}</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{selected}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <Menu.Content>
        <div className="grid grid-cols-4 gap-3">
          {shaders.map((s) => (
            <div
              key={s.name}
              onClick={() => onSelect(s)}
              className={twMerge(
                'size-16 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                `item-color-${s.name}`,
                clsx(s.name === selected && 'outline-2'),
              )}
            />
          ))}
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}
