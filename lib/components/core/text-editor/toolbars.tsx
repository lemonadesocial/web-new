import React, { KeyboardEvent } from 'react';
import clsx from 'clsx';
import { Button } from '../button';
import { Input } from '../input';
import { Card } from '../card';

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
    <Button
      variant="flat"
      className={clsx('justify-start hover:bg-[var(--btn-tertiary)]!', active && 'bg-[var(--btn-tertiary)]')}
      disabled={busy}
      onClick={onClick}
      size="sm"
      iconLeft={icons[icon]}
    >
      {label}
    </Button>
  );
}
