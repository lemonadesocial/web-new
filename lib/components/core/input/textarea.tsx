'use client';

import React from 'react';

type Props = {
  label?: string;
  value?: string;
  rows?: number;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeText?: (value: string) => void;
};

export function TextAreaField(props: Props) {
  return (
    <fieldset className="input-field">
      {props.label && <label className="text-secondary text-sm font-medium">{props.label}</label>}
      <div className="control">
        <textarea
          rows={props.rows}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => {
            props.onChange?.(e);
            props.onChangeText?.(e.target.value);
          }}
        ></textarea>
      </div>
    </fieldset>
  );
}
