'use client';

import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

import { useQuery } from '$lib/graphql/request';
import { coinClient } from '$lib/graphql/request/instances';
import {
  EnvelopeDocument,
  type EnvelopeQuery,
  type EnvelopeQueryVariables,
} from '$lib/graphql/generated/coin/graphql';
import { useAppKitAccount } from '$lib/utils/appkit';
import { Button, Checkbox, Chip, modal, toast, Menu, MenuItem, Segment, InputField } from '$lib/components/core';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { BuyRedEnvelopesListModal } from '$lib/components/features/cny/modals/BuyRedEnvelopesListModal';
import { ImportCSVModal } from '$lib/components/features/cny/modals/ImportCSVModal';
import { SealRedEnvelopesModal } from '$lib/components/features/cny/modals/SealRedEnvelopesModal';
import {
  getListChains,
} from '$lib/utils/crypto';
import { ASSET_PREFIX, MEGAETH_CHAIN_ID } from '$lib/utils/constants';
import { RedEnvelopeClient } from '$lib/services/red-envelope/client';
import { formatNumber } from '$lib/utils/number';
import { EnvelopeRow } from '$lib/components/features/cny/types';
import { useMediaQuery } from '$lib/hooks/useMediaQuery';

const RECIPIENT_PLACEHOLDER = 'Who do you want to send this to?';

function isRowValid(row: EnvelopeRow): boolean {
  const addressValid = ethers.isAddress(row.recipient.trim());
  const amountTrimmed = row.amount.trim();
  const amountValid =
    amountTrimmed !== '' &&
    !Number.isNaN(Number(amountTrimmed)) &&
    Number(amountTrimmed) >= 0;
  return addressValid && amountValid;
}

function envelopeToRow(e: EnvelopeQuery['Envelope'][number]): EnvelopeRow {
  return {
    id: e.id,
    token_id: Number(e.token_id),
    selected: false,
    recipient: e.recipient ?? '',
    amount: e.amount ?? '',
    message: e.message ?? '',
  };
}

function parseCSVAddresses(text: string): string[] {
  const seen = new Set<string>();
  const addresses: string[] = [];
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const cells = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

    for (const cell of cells) {
      const trimmed = cell.trim();
      if (trimmed && ethers.isAddress(trimmed) && !seen.has(trimmed.toLowerCase())) {
        seen.add(trimmed.toLowerCase());
        addresses.push(ethers.getAddress(trimmed));
      }
    }
  }

  return addresses;
}

function SendPage() {
  const { address } = useAppKitAccount();
  const [localRows, setLocalRows] = useState<EnvelopeRow[]>([]);
  const [focusedRecipientRowId, setFocusedRecipientRowId] = useState<string | null>(null);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const [currencyDecimals, setCurrencyDecimals] = useState<number | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);
  const [isSplitDropdownOpen, setIsSplitDropdownOpen] = useState(false);
  const [splitType, setSplitType] = useState<'equally' | 'randomly'>('equally');
  const [totalBudget, setTotalBudget] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useMediaQuery('md');

  useEffect(() => {
    const client = RedEnvelopeClient.getInstance();
    Promise.all([client.getCurrencyDecimals(), client.getCurrencySymbol()]).then(
      ([decimals, symbol]) => {
        setCurrencyDecimals(decimals);
        setCurrencySymbol(symbol);
      }
    );
  }, []);

  const { loading, refetch } = useQuery<EnvelopeQuery, EnvelopeQueryVariables>(
    EnvelopeDocument,
    {
      variables: {
        where: {
          _and: [
            { owner: { _eq: address?.toLowerCase() ?? '' } },
            { sealed_at: { _is_null: true } },
          ],
        },
      },
      skip: !address,
      onComplete: (data) => {
        if (data?.Envelope) {
          setLocalRows(data.Envelope.map(envelopeToRow));
        }
      },
    },
    coinClient
  );

  const updateRow = (id: string, updates: Partial<EnvelopeRow>) => {
    setLocalRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const clearRow = (id: string) => {
    setLocalRows((prev) => prev.filter((r) => r.id !== id));
    setOpenMenuRowId(null);
  };

  const getInputKey = (rowIndex: number, colIndex: number) => {
    return `${rowIndex}-${colIndex}`;
  };

  const focusCell = (rowIndex: number, colIndex: number) => {
    const key = getInputKey(rowIndex, colIndex);
    const input = inputRefs.current[key];
    if (input) input.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const input = e.currentTarget;
    const atStart = input.selectionStart === 0;
    const atEnd = input.selectionStart === input.value.length;

    if (e.key === 'ArrowUp' && rowIndex > 0) return focusCell(rowIndex - 1, colIndex);
    if (e.key === 'ArrowDown' && rowIndex < localRows.length - 1)
      return focusCell(rowIndex + 1, colIndex);
    if (e.key === 'ArrowLeft' && atStart && colIndex > 1)
      return focusCell(rowIndex, colIndex - 1);
    if (e.key === 'ArrowRight' && atEnd && colIndex < 3)
      return focusCell(rowIndex, colIndex + 1);
  };

  const selectedRows = localRows.filter((r) => r.selected);
  const sumAmount = localRows.reduce(
    (acc, row) => acc + (Number(row.amount) || 0),
    0
  );

  const allSelected = localRows.length > 0 && localRows.every((r) => r.selected);

  const handleSelectAll = (checked: boolean) => {
    setLocalRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const handleSplitAmount = () => {
    if (selectedRows.length === 0) {
      toast.error('Select at least one envelope to split amount');
      return;
    }

    const budget = Math.floor(Number(totalBudget));
    if (isNaN(budget) || budget <= 0) {
      toast.error('Please enter a valid total budget');
      return;
    }

    const selectedRowIds = selectedRows.map((r) => r.id);
    const count = selectedRowIds.length;

    if (budget < count) {
      toast.error(`Budget must be at least ${count} to split across ${count} envelope${count > 1 ? 's' : ''}`);
      return;
    }

    if (splitType === 'equally') {
      const baseAmount = Math.floor(budget / count);
      const remainder = budget % count;
      const amounts: number[] = [];

      for (let i = 0; i < count; i++) {
        amounts.push(baseAmount + (i < remainder ? 1 : 0));
      }

      setLocalRows((prev) =>
        prev.map((row) => {
          const index = selectedRowIds.indexOf(row.id);
          return index !== -1
            ? { ...row, amount: amounts[index].toString() }
            : row;
        })
      );
    } else {
      const min = Math.floor(Number(minAmount) || 1);
      const max = Math.floor(Number(maxAmount) || budget);

      if (min < 1) {
        toast.error('Min amount must be at least 1');
        return;
      }

      if (max < min || max > budget) {
        toast.error('Invalid min/max values');
        return;
      }

      if (min * count > budget) {
        toast.error(`Min amount too high: ${min} × ${count} = ${min * count} exceeds budget ${budget}`);
        return;
      }

      const amounts: number[] = [];
      let remaining = budget;

      for (let i = 0; i < count - 1; i++) {
        const availableMax = Math.min(max, remaining - (count - i - 1) * min);
        const availableMin = Math.max(min, remaining - (count - i - 1) * max);
        const randomAmount = availableMin <= availableMax
          ? Math.floor(Math.random() * (availableMax - availableMin + 1)) + availableMin
          : availableMin;
        amounts.push(randomAmount);
        remaining -= randomAmount;
      }

      const lastAmount = Math.max(min, Math.min(max, remaining));
      if (lastAmount < 1) {
        toast.error('Unable to split: constraints cannot produce positive amounts');
        return;
      }
      amounts.push(lastAmount);

      setLocalRows((prev) =>
        prev.map((row) => {
          const index = selectedRowIds.indexOf(row.id);
          return index !== -1
            ? { ...row, amount: amounts[index].toString() }
            : row;
        })
      );
    }

    setIsSplitDropdownOpen(false);
    setTotalBudget('');
    setMinAmount('');
    setMaxAmount('');
  };

  const openImportCSVFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleCSVFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const addresses = parseCSVAddresses(text);
      if (addresses.length === 0) {
        toast.error('No valid wallet addresses found in the CSV file');
        return;
      }
      modal.open(ImportCSVModal, {
        props: {
          addresses,
          onImport: (addrs) => {
            setLocalRows((prev) => {
              const emptyIndices: number[] = [];
              prev.forEach((row, i) => {
                if (row.recipient.trim() === '') emptyIndices.push(i);
              });

              const toFill = emptyIndices.slice(0, addrs.length);
              const fillSet = new Set(toFill);
              let addrIndex = 0;

              return prev.map((row, i) => {
                if (!fillSet.has(i)) return row;
                const recipient = addrs[addrIndex];
                addrIndex += 1;
                return { ...row, recipient };
              });
            });
          },
          onImportAnotherCsv: openImportCSVFilePicker,
        },
      });
    };

    reader.readAsText(file);
  };

  const handleSealOrConnect = () => {
    if (selectedRows.length === 0) {
      toast.error('Select at least one row to seal');
      return;
    }

    if (currencyDecimals == null) {
      toast.error('Currency not loaded');
      return;
    }

    const invalidRows = selectedRows.filter((row) => !isRowValid(row));
    if (invalidRows.length > 0) {
      const invalidEnvelopeNumbers = invalidRows.map((r) => `#${r.token_id}`).join(', ');
      toast.error(`Please fix invalid rows before sealing: ${invalidEnvelopeNumbers}`);
      return;
    }

    const chains = getListChains();
    const megaEthChain = chains.find((chain) => chain.chain_id === MEGAETH_CHAIN_ID.toString());

    modal.open(ConnectWallet, {
      props: {
        chain: megaEthChain,
        onConnect: () => {
          modal.open(SealRedEnvelopesModal, {
            props: {
              selectedRows,
              currencyDecimals,
              onComplete: () => {
                refetch();
              },
            },
          });
        },
      },
    });
  };

  const headerCellClass =
    'border-b border-r first:border-l last:border-r-0 px-3 py-2 align-middle text-left text-sm font-medium text-tertiary';
  const rowCellClass =
    'border-b border-r first:border-l last:border-r-0 p-3 align-middle';
  const inputClass =
    'h-auto w-full bg-transparent border-0 rounded-none px-0 focus:ring-0 focus:outline-none placeholder-quaternary font-medium';

  return (
    <>
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleCSVFileSelect}
        />
        <div className="flex items-center gap-2 py-3 px-4 border-b">
          <Button
            variant="tertiary-alt"
            size="sm"
            iconLeft="icon-download"
            onClick={openImportCSVFilePicker}
          >
            {isDesktop ? 'Import CSV' : 'Import'}
          </Button>
          <Menu.Root
            isOpen={isSplitDropdownOpen}
            onOpenChange={setIsSplitDropdownOpen}
            placement="bottom-start"
          >
            <Menu.Trigger>
              <Button variant="tertiary-alt" size="sm" iconLeft="icon-arrow-split">
                {isDesktop ? 'Split Amount' : 'Split'}
              </Button>
            </Menu.Trigger>
            <Menu.Content className="w-[340px] p-4">
              {({ toggle }) => (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary mb-3">Total Budget</p>
                    <InputField
                      value={totalBudget}
                      onChangeText={setTotalBudget}
                      type="number"
                      placeholder="0"
                      min={0}
                      subfix={currencySymbol ?? 'USDm'}
                      className="mb-2"
                    />
                    <p className="text-sm text-tertiary">
                      This amount will be split across the selected envelopes.
                    </p>
                  </div>

                  <hr className="border-divider border-t -mx-4" />

                  <Segment
                    items={[
                      { label: 'Equally', value: 'equally' },
                      { label: 'Randomly', value: 'randomly' },
                    ]}
                    selected={splitType}
                    onSelect={(item) => setSplitType(item.value as 'equally' | 'randomly')}
                    className="w-full"
                  />

                  {splitType === 'randomly' && (
                    <div className="grid grid-cols-2 gap-2">
                      <InputField
                        label="Min"
                        value={minAmount}
                        onChangeText={setMinAmount}
                        type="number"
                        placeholder="0"
                        min={0}
                        subfix={currencySymbol ?? 'USDm'}
                      />
                      <InputField
                        label="Max"
                        value={maxAmount}
                        onChangeText={setMaxAmount}
                        type="number"
                        placeholder="0"
                        min={0}
                        subfix={currencySymbol ?? 'USDm'}
                      />
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleSplitAmount}
                  >
                    Split
                  </Button>
                </div>
              )}
            </Menu.Content>
          </Menu.Root>
          <Button
            variant="tertiary-alt"
            size="sm"
            icon={isDesktop ? undefined : 'icon-plus'}
            iconLeft={isDesktop ? 'icon-plus' : undefined}
            className="ml-auto"
            onClick={() => modal.open(BuyRedEnvelopesListModal)}
          >
            Buy Envelopes
          </Button>
        </div>

        <div className="w-full border-b overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
          <table className="min-w-[1120px] w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '140px' }} />
              <col style={{ width: '400px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '400px' }} />
              <col style={{ width: '80px' }} />
            </colgroup>
            <thead>
              <tr className="border-b">
                <th className={headerCellClass}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      value={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      containerClass="shrink-0"
                    />
                    <span>Envelope</span>
                  </div>
                </th>
                <th className={`${headerCellClass} w-[400px] shrink-0`}>Wallet ID</th>
                <th className={`${headerCellClass} min-w-[100px]`}>
                  <span className="flex justify-between items-center gap-2">
                    <span>{currencySymbol ?? '—'}</span>
                    <span className="tabular-nums">
                      {sumAmount > 0 ? formatNumber(Number(sumAmount)) : '—'}
                    </span>
                  </span>
                </th>
                <th className={`${headerCellClass} min-w-[400px]`}>Message (Optional)</th>
                <th className={headerCellClass} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className={`${rowCellClass} p-4 text-center text-tertiary text-sm`}>
                    Loading...
                  </td>
                </tr>
              ) : (
                localRows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className="border-b border-primary/8 last:border-b-0 focus-within:bg-card"
                  >
                    <td className={rowCellClass}>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`envelope-${row.id}`}
                          value={row.selected}
                          onChange={(e) => updateRow(row.id, { selected: e.target.checked })}
                          containerClass="shrink-0"
                        />
                        <img
                          src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/1-envelope.png`}
                          alt=""
                          className="h-5 object-contain shrink-0"
                        />
                        <p className="text-secondary shrink-0">
                          {row.token_id === 0 ? '—' : `#${row.token_id}`}
                        </p>
                      </div>
                    </td>
                    <td
                      className={`${rowCellClass} w-[400px] max-w-[400px] shrink-0 focus-within:outline focus-within:outline-[var(--color-primary)] focus-within:outline-offset-[-1px] focus-within:z-10 focus-within:relative cursor-text`}
                      onClick={() => focusCell(rowIndex, 1)}
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[getInputKey(rowIndex, 1)] = el;
                        }}
                        type="text"
                        placeholder={focusedRecipientRowId === row.id ? RECIPIENT_PLACEHOLDER : ''}
                        value={row.recipient}
                        onChange={(e) => updateRow(row.id, { recipient: e.target.value })}
                        onFocus={() => setFocusedRecipientRowId(row.id)}
                        onBlur={() => setFocusedRecipientRowId(null)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                        className={inputClass}
                      />
                    </td>
                    <td
                      className={`${rowCellClass} min-w-[100px] focus-within:outline focus-within:outline-[var(--color-primary)] focus-within:outline-offset-[-1px] focus-within:z-10 focus-within:relative cursor-text`}
                      onClick={() => focusCell(rowIndex, 2)}
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[getInputKey(rowIndex, 2)] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        value={row.amount}
                        onChange={(e) => updateRow(row.id, { amount: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 2)}
                        className={`${inputClass} min-w-[80px] w-12 text-right`}
                      />
                    </td>
                    <td
                      className={`${rowCellClass} min-w-[400px] focus-within:outline focus-within:outline-[var(--color-primary)] focus-within:outline-offset-[-1px] focus-within:z-10 focus-within:relative cursor-text`}
                      onClick={() => focusCell(rowIndex, 3)}
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[getInputKey(rowIndex, 3)] = el;
                        }}
                        type="text"
                        value={row.message}
                        onChange={(e) => updateRow(row.id, { message: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 3)}
                        className={inputClass}
                      />
                    </td>
                    <td className={rowCellClass}>
                      <div className="flex items-center gap-2">
                        {isRowValid(row) ? (
                          <Chip
                            variant="success"
                            size="xxs"
                            icon="icon-check-filled"
                            className="rounded-full shrink-0"
                          />
                        ) : (
                          <Chip
                            variant="secondary"
                            size="xxs"
                            icon="icon-error"
                            className="rounded-full size-5"
                          />
                        )}
                        <Menu.Root
                          placement="bottom-end"
                          isOpen={openMenuRowId === row.id}
                          onOpenChange={(open) => setOpenMenuRowId(open ? row.id : null)}
                        >
                          <Menu.Trigger>
                            <i role="button" className="icon-more-horiz size-5 text-quaternary cursor-pointer" />
                          </Menu.Trigger>
                          <Menu.Content
                            className="rounded-lg bg-overlay-secondary p-1 min-w-[140px]"
                            onClick={() => setOpenMenuRowId(null)}
                          >
                            <MenuItem
                              title="Clear Row"
                              iconLeft="icon-delete"
                              onClick={() => clearRow(row.id)}
                            />
                          </Menu.Content>
                        </Menu.Root>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 z-[9] flex items-center justify-between px-4 py-3 bg-page-background-overlay border-t">
        {selectedRows.length > 0 ? (
          <div className="flex items-center gap-1">
            <p className="text-tertiary">{selectedRows.length} selected</p>
            <i className="icon-chevron-right size-5 text-quaternary" />
          </div>
        ) : (
          <p className="text-tertiary text-sm md:text-base">Select multiple rows to perform batch actions</p>
        )}
        <Button
          variant="secondary"
          onClick={handleSealOrConnect}
          disabled={selectedRows.length === 0 || currencyDecimals == null}
        >
          Seal & Send
        </Button>
      </footer>
    </>
  );
}

export default SendPage;
