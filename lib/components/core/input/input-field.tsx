'use client';

import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  label?: string;
  value?: string | null;
  placeholder?: string;
  iconLeft?: string;
  right?: { icon: string; onClick?: () => void };
  prefix?: string;
  name?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (value: string) => void;
  error?: boolean;
  hint?: string;
  autoFocus?: boolean;
};

export function InputField(props: Props) {
  return (
    <fieldset className="input-field">
      {props.label && <label className="text-secondary text-sm font-medium">{props.label}</label>}
      <div className={clsx('control', props.error && 'border-danger-500!')}>
        {props.prefix && <div className="prefix text-base font-medium text-secondary">{props.prefix}</div>}
        {props.iconLeft && <i className={twMerge('size-5 text-tertiary', props.iconLeft)} />}
        <input
          value={props.value || ''}
          type="text"
          name={props.name}
          readOnly={props.readOnly}
          autoFocus={props.autoFocus}
          placeholder={props.placeholder}
          onChange={(e) => {
            props.onChange?.(e);
            props.onChangeText?.(e.target.value);
          }}
        />
        {props.right && (
          <i className={twMerge('size-5 text-tertiary', props.right.icon)} onClick={props.right.onClick} />
        )}
      </div>
      {props.hint && <p className={clsx('text-xs', props.error && 'text-danger-400')}>{props.hint}</p>}
    </fieldset>
  );
}
