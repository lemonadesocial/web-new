'use client';
import { useState, useRef } from 'react';

interface OptionsInputProps {
  value: string[];
  onChange: (options: string[]) => void;
  placeholder?: string;
  hint?: string;
}

export function OptionsInput({
  value,
  onChange,
  placeholder = 'Add options',
  hint = 'Press Enter or Tab key to add a new option',
}: OptionsInputProps) {
  const [currentOption, setCurrentOption] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddOption = () => {
    if (currentOption.trim() && !value.includes(currentOption.trim())) {
      onChange([...value, currentOption.trim()]);
      setCurrentOption('');
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    onChange(value.filter((option) => option !== optionToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleAddOption();
    }

    if (e.key === 'Backspace' && currentOption === '' && value.length > 0) {
      e.preventDefault();
      const lastOption = value[value.length - 1];
      handleRemoveOption(lastOption);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap items-center w-full rounded-sm bg-background/64 border-primary/8 hover:border-primary focus:border-primary placeholder-quaternary px-1 h-10 font-medium gap-0.5 h-auto py-1.5 min-h-[40px]"
        onClick={handleContainerClick}
      >
        {value.map((option, index) => (
          <div key={index} className="flex items-center gap-1.5 px-2.5 h-6.5 bg-primary/8 rounded-sm">
            <span className="text-sm">{option}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveOption(option);
              }}
              className="text-quaternary hover:text-primary"
            >
              <i aria-hidden="true" className="icon-x size-4" />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={currentOption}
          onChange={(e) => setCurrentOption(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm placeholder:text-quaternary ml-2.5"
        />
      </div>
      <p className="text-sm text-secondary">{hint}</p>
    </div>
  );
}
