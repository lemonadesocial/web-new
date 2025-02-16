import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export default function Input({ errorMessage, ...rest }: InputProps) {
  return (
    <div>
      <div>
        <label className="block mb-2 text-sm font-medium">asd</label>
        <div className="border border-[--border-color]">
          <input {...rest} />
        </div>
      </div>
      {errorMessage && <span className="text-danger"></span>}
    </div>
  );
}
