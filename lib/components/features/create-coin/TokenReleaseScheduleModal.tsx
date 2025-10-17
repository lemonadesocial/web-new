'use client';
import React, { useState } from 'react';
import { Button, InputField, modal } from '$lib/components/core';

type AllocationRecipient = {
  address: string;
  percentage: number;
  locked: boolean;
  lockedSupply: number; // Percentage of allocation that is locked
  cliff: number; // months
  duration: number; // months
  interval: 'monthly' | 'daily';
};

export function TokenReleaseScheduleModal({
  recipient,
  onConfirm,
}: {
  recipient: AllocationRecipient;
  onConfirm: (data: Pick<AllocationRecipient, 'lockedSupply' | 'cliff' | 'duration' | 'interval'>) => void;
}) {
  const [tokenReleaseForm, setTokenReleaseForm] = useState({
    lockedSupply: recipient.lockedSupply || 50, // Use recipient's lockedSupply or default to 50%
    cliffPeriod: recipient.cliff,
    vestingSchedule: recipient.duration,
    unlocks: recipient.interval
  });

  const handleConfirm = () => {
    onConfirm({
      cliff: tokenReleaseForm.cliffPeriod,
      duration: tokenReleaseForm.vestingSchedule,
      interval: tokenReleaseForm.unlocks,
      lockedSupply: tokenReleaseForm.lockedSupply
    });
    modal.close();
  };

  return (
    <div className="max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-card-border">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/8 border border-card-border">
            <i className="icon-tune text-secondary size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Token Release Schedule</h2>
            <p className="text-secondary text-sm">
              {recipient.address ? 
                `${recipient.address.slice(0, 6)}...${recipient.address.slice(-4)} · ${recipient.percentage}%` : 
                '0x947E...8B21 · 40%'
              }
            </p>
            <p className="text-tertiary text-xs">Control when your tokens become available.</p>
          </div>
        </div>
        <button
          onClick={() => modal.close()}
          className="flex size-8 items-center justify-center rounded-full bg-primary/8 border border-card-border hover:bg-primary/16 transition-colors"
        >
          <i className="icon-x text-secondary size-4" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-secondary text-sm font-medium">Locked Supply</label>
          <div className="flex items-center gap-2">
            <InputField
              value={tokenReleaseForm.lockedSupply.toString()}
              onChangeText={(value) => setTokenReleaseForm(prev => ({ ...prev, lockedSupply: parseInt(value) || 0 }))}
              type="number"
            />
            <span className="text-secondary text-sm">%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-secondary text-sm font-medium">Cliff Period</label>
          <div className="flex items-center gap-2">
            <InputField
              value={tokenReleaseForm.cliffPeriod.toString()}
              onChangeText={(value) => setTokenReleaseForm(prev => ({ ...prev, cliffPeriod: parseInt(value) || 0 }))}
              type="number"
            />
            <span className="text-secondary text-sm">months</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-secondary text-sm font-medium">Vesting Schedule</label>
          <div className="flex items-center gap-2">
            <InputField
              value={tokenReleaseForm.vestingSchedule.toString()}
              onChangeText={(value) => setTokenReleaseForm(prev => ({ ...prev, vestingSchedule: parseInt(value) || 0 }))}
              type="number"
            />
            <span className="text-secondary text-sm">months</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-secondary text-sm font-medium">Unlocks</label>
          <select
            value={tokenReleaseForm.unlocks}
            onChange={(e) => setTokenReleaseForm(prev => ({ ...prev, unlocks: e.target.value as 'monthly' | 'daily' }))}
            className="bg-card border border-card-border rounded-md px-3 py-2 text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/20"
          >
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        {/* Summary Text */}
        <p className="text-secondary text-sm">
          {tokenReleaseForm.lockedSupply}% of {recipient.percentage}% allocation ({((tokenReleaseForm.lockedSupply / 100) * recipient.percentage).toFixed(1)}% total) unlocks after {tokenReleaseForm.cliffPeriod} months, released {tokenReleaseForm.unlocks === 'monthly' ? 'monthly' : 'daily'} over the next {tokenReleaseForm.vestingSchedule} months.
        </p>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-card-border">
        <Button
          onClick={handleConfirm}
          className="w-full"
          variant="primary"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
