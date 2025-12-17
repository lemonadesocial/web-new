import { useState, useEffect } from 'react';
import { Button } from '$lib/components/core';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface SlippageSelectProps {
  value: number;
  onChange: (value: number) => void;
}

const presetValues = [0.1, 0.5, 1];

export function SlippageSelect({ value, onChange }: SlippageSelectProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customValue, setCustomValue] = useState(value.toString());

  const isPreset = presetValues.includes(value);

  useEffect(() => {
    setCustomValue(value.toString());
  }, [value]);

  const handlePresetClick = (preset: number) => {
    onChange(preset);
    setIsExpanded(false);
  };

  const handleCustomChange = (inputValue: string) => {
    setCustomValue(inputValue);
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
    }
  };

  const handleCustomBlur = () => {
    if (customValue === '' || isNaN(parseFloat(customValue))) {
      setCustomValue(value.toString());
    }
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between py-2.5 px-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="text-sm text-tertiary">Slippage</p>
        <div className="flex items-center gap-1">
          <p className="text-sm text-tertiary">{value}%</p>
          <i
            className={twMerge(
              'icon-chevron-down text-tertiary size-4 transition-transform',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {presetValues.map((preset) => (
              <Button
                key={preset}
                size="xs"
                variant="tertiary"
                onClick={() => handlePresetClick(preset)}
                className={clsx(
                  'flex-1',
                  isPreset && value === preset && 'bg-primary/16'
                )}
              >
                {preset}%
              </Button>
            ))}
            <div className="flex items-center gap-0 flex-1">
              <input
                type="text"
                value={customValue}
                onChange={(e) => handleCustomChange(e.target.value)}
                onBlur={handleCustomBlur}
                onClick={(e) => e.stopPropagation()}
                className="w-[60px] h-[30px] py-1 px-2 rounded-l-sm text-primary text-sm outline-none border-none bg-background/64"
                placeholder="0"
              />
              <Button
                size="xs"
                variant="tertiary"
                className="rounded-r-sm rounded-l-none"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                %
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

