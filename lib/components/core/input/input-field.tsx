'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  label?: string;
  value?: string;
  placeholder?: string;
  iconLeft?: string;
  right?: { icon: string; onClick?: () => void };
  prefix?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (value: string) => void;
};

export function InputField(props: Props) {
  return (
    <fieldset className="input-field">
      {props.label && <label className="text-secondary text-sm font-medium">{props.label}</label>}
      <div className="control">
        {props.prefix && <div className="prefix text-base font-medium text-secondary">{props.prefix}</div>}
        {props.iconLeft && <i className={twMerge('size-5 text-tertiary', props.iconLeft)} />}
        <input
          value={props.value}
          type="text"
          readOnly
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
    </fieldset>
  );
}
