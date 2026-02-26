import React, { KeyboardEvent } from 'react';
import clsx from 'clsx';
import { Button } from '../button';
import { Input } from '../input';
import { Card } from '../card';
import { twMerge } from 'tailwind-merge';

export const icons: Record<string, string> = {
  h1: 'icon-richtext-h1',
  h2: 'icon-richtext-h2',
  bold: 'icon-richtext-bold',
  italic: 'icon-richtext-italic',
  underline: 'icon-richtext-underline-line',
  strike: 'icon-richtext-strike-through',
  divider: 'icon-richtext-divider',
  code_block: 'icon-richtext-code',
  link: 'icon-richtext-round-insert-link',
  blockquote: 'icon-richtext-quote',
  image: 'icon-richtext-image',
  bullet_list: 'icon-richtext-bullet-list',
  ordered_list: 'icon-richtext-order-list',
};

type ToggleButtonProps = { icon: string; active?: boolean; onClick?: () => void };

export function ToggleButton({ icon, active, onClick }: ToggleButtonProps) {
  return (
    <Button
      size="sm"
      icon={clsx(icons[icon], active && 'text-accent-400')}
      variant="flat"
      className={clsx('hover:bg-[var(--btn-tertiary)]!')}
      onClick={onClick}
    />
  );
}

type InputPromptProps = {
  type?: string;
  value?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
  placeholder?: string;
};

export function InputPrompt({ value, onClose, onConfirm, placeholder, type = 'text' }: InputPromptProps) {
  const [data, setData] = React.useState(value);

  const handleKeyboardEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }

    if (data && e.key === 'Enter') {
      onConfirm(data);
    }
  };

  return (
    <Card.Root>
      <Card.Content className="flex p-1 bg-card backdrop-blur-2xl items-center">
        <Input
          autoFocus
          type={type}
          value={data}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none!"
          onChange={(e) => setData(e.currentTarget.value)}
          onKeyDown={handleKeyboardEvent}
        />
        <div className="flex">
          <Button
            type="button"
            size="sm"
            variant="flat"
            icon="icon-richtext-check"
            className="hover:bg-[var(--btn-tertiary)]!"
            onClick={() => data && onConfirm(data)}
          />
          <Button
            type="button"
            size="sm"
            variant="flat"
            icon="icon-richtext-trash"
            className="hover:bg-[var(--btn-tertiary)]!"
            onClick={onClose}
          />
        </div>
      </Card.Content>
    </Card.Root>
  );
}

type FloatingMenuItem = ToggleButtonProps & { label: string; busy?: boolean };

export function FloatingMenuItem({ icon, busy, label, onClick, active }: FloatingMenuItem) {
  return (
    <div
      className="px-2.5 py-1.5 cursor-pointer hover:bg-(--btn-tertiary) flex justify-between items-center w-44 rounded-xs"
      onClick={() => {
        if (busy) return;
        onClick?.();
      }}
    >
      <div className="flex gap-1.5 text-sm items-center">
        <i aria-hidden="true" className={twMerge('size-4', icons[icon])} />
        <p className="text-nowrap">{label}</p>
      </div>

      {busy && (
        <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </div>
  );
}
