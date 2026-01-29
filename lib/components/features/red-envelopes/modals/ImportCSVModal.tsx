'use client';

import { useState, useEffect } from 'react';

import { Button, modal } from '$lib/components/core';

type ImportCSVModalProps = {
  addresses: string[];
  onImport: (addresses: string[]) => void;
  onImportAnotherCsv: () => void;
};

function truncateAddress(address: string) {
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ImportCSVModal({ addresses: initialAddresses, onImport, onImportAnotherCsv }: ImportCSVModalProps) {
  const [addresses, setAddresses] = useState<string[]>(initialAddresses);

  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  const handleRemove = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImportAnother = () => {
    modal.close();
    onImportAnotherCsv();
  };

  const handleImport = () => {
    onImport(addresses);
    modal.close();
  };

  return (
    <div className="w-[480px] max-w-full flex flex-col">
      <div className="px-4 py-3 border-b border-divider flex justify-between items-center bg-card">
        <p className="text-lg">Import CSV</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </div>
      <div className="flex flex-col flex-1 min-h-0 space-y-4 p-4">
        <div
          role="button"
          tabIndex={0}
          onClick={handleImportAnother}
          onKeyDown={(e) => e.key === 'Enter' && handleImportAnother()}
          className="py-3 px-6 rounded-sm border border-dashed border-divider bg-card cursor-pointer text-secondary"
        >
          <p className="text-secondary text-center">Import Another CSV</p>
        </div>
        <div className="flex-1 overflow-y-auto bg-card rounded-md border-card-border min-h-0">
          {addresses.map((address, index) => (
            <div
              key={`${address}-${index}`}
              className="flex items-center gap-2 py-2 px-3"
            >
              <p className="flex-1">
                {truncateAddress(address)}
              </p>
              <i
                role="button"
                tabIndex={0}
                className="icon-x size-5 shrink-0 cursor-pointer text-tertiary hover:text-secondary"
                onClick={() => handleRemove(index)}
                onKeyDown={(e) => e.key === 'Enter' && handleRemove(index)}
              />
            </div>
          ))}
        </div>
        <Button variant="secondary" className="w-full" onClick={handleImport} disabled={addresses.length === 0}>
          Import
        </Button>
      </div>
    </div>
  );
}
