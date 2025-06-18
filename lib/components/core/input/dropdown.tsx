'use client';
import React from 'react';
import { InputField } from './input-field';
import { Menu, MenuItem } from '../menu';

type Option = {
  icon?: string;
  key: string | number;
  value: string;
};

type Props = {
  iconLeft?: string;
  value?: Option;
  placeholder?: string;
  options: Option[];
  onSelect?: (option: Option) => void;
};

export function Dropdown(props: Props) {
  const [selected, setSelected] = React.useState<Option | undefined>(props.value);

  React.useEffect(() => {
    if (props.value) setSelected(props.value);
  }, [props.value]);

  return (
    <Menu.Root>
      <Menu.Trigger>
        <InputField
          iconLeft={props.iconLeft}
          placeholder={props.placeholder}
          right={{ icon: 'icon-chevron-down' }}
          value={selected?.value}
          readOnly
        />
      </Menu.Trigger>
      <Menu.Content className="w-full p-2">
        {({ toggle }) => (
          <>
            {props.options.map((item) => (
              <MenuItem
                key={item.key}
                title={item.value}
                iconLeft={item.icon}
                iconRight={item.key === selected?.key ? 'text-primary! icon-richtext-check' : undefined}
                onClick={() => {
                  const opt = props.options.find((o) => o.key === item.key) as Option;
                  setSelected(opt);
                  props.onSelect?.(opt);
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
