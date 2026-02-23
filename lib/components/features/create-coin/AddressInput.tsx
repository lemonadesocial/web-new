'use client';

import { useState, useRef } from 'react';
import { ethers } from 'ethers';

import { Input } from "$lib/components/core/input";
import { MainnetRpcProvider } from '$lib/utils/crypto';

type AddressInputProps = {
  value?: string;
  onChange: (address: string) => void;
  placeholder?: string;
  variant?: 'default' | 'outlined';
};

export function AddressInput({ value = '', onChange, placeholder = 'Wallet Address or ENS', variant = 'outlined' }: AddressInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const trimmedValue = newValue.trim();

    if (!trimmedValue) {
      setDisplayText(null);
      onChange('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(async () => {
      const isAddress = ethers.isAddress(trimmedValue);
      const isEnsName = trimmedValue.includes('.eth');

      if (isAddress) {
        onChange(trimmedValue);

        const name = await MainnetRpcProvider.lookupAddress(trimmedValue);
        
        setDisplayText(name);

        setIsLoading(false);
        return;
      }
      
      if (isEnsName) {
        const address = await MainnetRpcProvider.resolveName(trimmedValue);

        if (address) {
          onChange(address);
        }
        setDisplayText(address);
        
        setIsLoading(false);
        return;
      }
      
      setDisplayText(null);
      onChange('');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="relative w-full">
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        variant={variant}
      />
      {
        displayText && (
          <p className="absolute bottom-0 left-3 text-[8px] text-tertiary">{displayText}</p>
        )
      }
       {
         isLoading && (
           <div className="absolute right-3 top-1/2 -translate-y-1/2">
             <i aria-hidden="true" className="icon-loader animate-spin text-tertiary" />
           </div>
         )
       }
    </div>
  );
}