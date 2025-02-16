import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button(props: ButtonProps) {
  return (
    <button {...props} className="bg-primary text-text-color">
      {props.children}
    </button>
  );
}
