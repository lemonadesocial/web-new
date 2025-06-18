'use client';
import React from 'react';
import { InputField } from './input-field';
import { Menu, MenuItem } from '../menu';

type Option = {
  key: string | number;
  value: string;
};

type Props = { iconLeft?: string; defaultValue?: Option; options: Option[]; onSelect?: (option: Option) => void };

export function Dropdown(props: Props) {
  const [selected, setSelected] = React.useState<Option | undefined>(props.defaultValue);
  return (
    <Menu.Root>
      <Menu.Trigger>
        <InputField iconLeft={props.iconLeft} iconRight="icon-chevron-dow" value={selected?.value} readOnly />
      </Menu.Trigger>
      <Menu.Content className="w-full p-2">
        {({ toggle }) => (
          <>
            {props.options.map((item) => (
              <MenuItem
                key={item.key}
                title={item.value}
                iconRight={item.key === selected?.key ? 'text-primary! icon-richtext-check' : undefined}
                onClick={() => {
                  const opt = props.options.find((o) => o.key === item.key);
                  setSelected(opt);
                  toggle();
                }}
              />
            ))}
          </>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
