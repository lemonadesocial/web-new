import clsx from "clsx";

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
        <button
          className={clsx('size-6 flex items-center justify-center bg-tertiary/8 rounded-xs', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
          onClick={value >= 1 ? () => onChange(value - 1) : undefined}
          disabled={value < 1 || disabled}
        >
          <i className="icon-minus size-3.5 text-tertiary/56" />
        </button>
        <input
          type="number"
          className="font-medium w-5 text-center appearance-none p-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          value={value}
          onChange={(e) => onChange(Math.min(e.target.valueAsNumber, limit ?? Infinity))}
        />
      </>}
      <button
        className={clsx('size-6 flex items-center justify-center bg-tertiary/8 rounded-xs', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
        onClick={() => onChange(Math.min(value + 1, limit ?? Infinity))}
        disabled={value === limit || disabled}
      >
        <i className="icon-plus size-3.5 text-tertiary/56" />
      </button>
    </div>
  );
}
