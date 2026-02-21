'use client';

import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  label?: string;
  value?: string | null;
  placeholder?: string;
  iconLeft?: string | React.ReactElement;
  right?: { icon: string; onClick?: () => void };
  prefix?: string;
  subfix?: string;
  name?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (value: string) => void;
  error?: boolean;
  hint?: string;
  autoFocus?: boolean;
  handleClear?: () => void;
  type?: string;
  className?: string;
  min?: number | string;
  max?: number | string;
};

export function InputField(props: Props) {
  return (
    <fieldset className={twMerge('input-field relative', props.className)}>
      {props.label && <label htmlFor={props.name} className="text-secondary text-sm font-medium">{props.label}</label>}
      <div className={clsx('control', props.error && 'border-error!')}>
        {props.prefix && <div className="prefix text-base font-medium text-secondary">{props.prefix}</div>}
        {typeof props.iconLeft === 'string' ? (
          <i aria-hidden="true" className={twMerge('size-5 text-tertiary', props.iconLeft)} />
        ) : (
          props.iconLeft
        )}
        <input
          id={props.name}
          value={props.value || ''}
          type={props.type || 'text'}
          name={props.name}
          readOnly={props.readOnly}
          autoFocus={props.autoFocus}
          placeholder={props.placeholder}
          min={props.min}
          max={props.max}
          onChange={(e) => {
            props.onChange?.(e);
            props.onChangeText?.(e.target.value);
          }}
        />
        {props.right && (
<<<<<<< HEAD
          <button type="button" aria-label="Clear" className="appearance-none bg-transparent border-none p-0 cursor-pointer" onClick={props.right.onClick}>
            <i className={twMerge('size-5 text-tertiary', props.right.icon)} />
          </button>
=======
          <i aria-hidden="true" className={twMerge('size-5 text-tertiary', props.right.icon)} onClick={props.right.onClick} />
>>>>>>> 1018631b (a11y(icons): add aria-hidden="true" to all 518 decorative <i> icon elements)
        )}
        {props.subfix && <div className="subfix text-base font-medium text-secondary">{props.subfix}</div>}
      </div>
      {props.hint && <p className={clsx('text-xs', props.error && 'text-danger-400')}>{props.hint}</p>}
    </fieldset>
  );
}
