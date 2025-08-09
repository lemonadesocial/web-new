'use client';

import clsx from 'clsx';
import React from 'react';

type Props = {
  label?: string;
  value?: string | null;
  rows?: number;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeText?: (value: string) => void;
  className?: string;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  autoFocus?: boolean;
};

export function TextAreaField(props: Props) {
  return (
    <fieldset className="input-field">
      {props.label && <label className="text-secondary text-sm font-medium">{props.label}</label>}
      <div className={clsx('control', props.className)}>
        <textarea
          rows={props.rows}
          value={props.value || ''}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          onChange={(e) => {
            props.onChange?.(e);
            props.onChangeText?.(e.target.value);
          }}
        ></textarea>
      </div>
    </fieldset>
  );
}
