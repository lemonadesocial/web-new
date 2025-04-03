import clsx from "clsx";

import { Button } from "../button";

interface NumberInputProps {
  value: number;
  limit?: number;
  onChange(value?: number): void;
  hideMinusAtZero?: boolean;
  disabled?: boolean;
}

export function NumberInput({ value, limit, onChange, hideMinusAtZero, disabled }: NumberInputProps) {
  return (
    <div className={clsx('flex items-center gap-2', disabled && 'opacity-30')}>
      {!(hideMinusAtZero && value === 0) && <>
        <Button
          icon="icon-minus"
          onClick={value >= 1 ? () => onChange(value - 1) : undefined}
          disabled={value < 1 || disabled}
          variant="tertiary"
          size="xs"
        />
        <input
          type="number"
          className="font-medium w-5 text-center appearance-none p-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield]"
          value={value}
          onChange={(e) => onChange(Math.min(e.target.valueAsNumber, limit ?? Infinity))}
        />
      </>}
      <Button
        icon="icon-plus"
        onClick={() => onChange(Math.min(value + 1, limit ?? Infinity))}
        disabled={value === limit || disabled}
        variant="tertiary"
        size="xs"
      />
    </div>
  );
}
