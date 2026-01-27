'use client';
import React from 'react';
import { InputField } from './input-field';
import { Menu, MenuItem } from '../menu';
import { Badge } from '../badge';

export type Option = {
  icon?: string;
  key: string | number;
  value: string;
};

interface DropdownProps {
  iconLeft?: string;
  disabeld?: boolean;
  label?: string;
  value?: Option;
  placeholder?: string;
  options: Option[];
  onSelect?: (option: Option) => void;
}

export function Dropdown(props: DropdownProps) {
  const [selected, setSelected] = React.useState<Option | undefined>(props.value);

  React.useEffect(() => {
    if (props.value) setSelected(props.value);
  }, [props.value]);

  return (
    <Menu.Root disabled={props.disabeld}>
      <Menu.Trigger>
        <InputField
          label={props.label}
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

interface DropdownTagsProps {
  iconLeft?: string;
  label?: string;
  value?: Option[];
  placeholder?: string;
  options: Option[];
  onSelect?: (options: Option[]) => void;
}

export function DropdownTags(props: DropdownTagsProps) {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Option[]>(props.value || []);
  const keys = selected.map((i) => i?.key);

  const handleRemove = (item: Option) => {
    const filtered = selected.filter((o) => o.key !== item.key);
    setSelected(filtered);
    props.onSelect?.(filtered);
  };

  const options = props.options.filter(
    (item) =>
      !query ||
      item.value.toLowerCase().includes(query.toLowerCase()) ||
      item.key.toString().toLowerCase().includes(query.toLowerCase()),
  );

  React.useEffect(() => {
    if (props.value) setSelected(props.value);
  }, [props.value?.length]);

  return (
    <Menu.Root>
      <Menu.Trigger>
        <fieldset className="input-field">
          {props.label && <label className="text-secondary text-sm font-medium">{props.label}</label>}
          <div className="control px-1.5! py-1! flex items-center min-h-[40px] h-auto! w-full">
            <div className="flex-1 w-full flex flex-wrap gap-1">
              {selected?.map((item) => (
                <Badge
                  key={item.key}
                  title={item.value}
                  className="btn btn-tertiary text-primary! text-sm rounded py-0.5! max-w-[200px]"
                  onClose={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                />
              ))}
            </div>
            <i className="icon-chevron-down size-5" />
          </div>
        </fieldset>
      </Menu.Trigger>
      <Menu.Content className="w-full p-0">
        {({ toggle }) => (
          <>
            <fieldset className="input-field border-b">
              <div className="control px-1.5! py-1! flex items-center border-none! h-[40px] rounded-none! bg-card!">
                <input
                  className=" outline-none!"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </fieldset>
            <div className="p-2 max-h-[200px] overflow-auto no-scrollbar">
              {options.map((item) => (
                <MenuItem
                  key={item.key}
                  title={item.value}
                  iconLeft={item.icon}
                  iconRight={keys.includes(item.key) ? 'text-primary! icon-richtext-check' : undefined}
                  onClick={() => {
                    const exist = props.options.find((o) => o.key === item.key) as Option;
                    if (exist) {
                      const result = [...selected, item];
                      setSelected(result);
                      props.onSelect?.(result);
                    }
                    toggle();
                    setQuery('');
                  }}
                />
              ))}
            </div>
          </>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
