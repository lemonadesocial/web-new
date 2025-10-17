'use client';
import React, { useState } from 'react';
import { Button, InputField, modal, ModalContent, Select } from '$lib/components/core';
import { formatWallet } from '$lib/utils/crypto';

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
    <ModalContent
      icon="icon-tune"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div>
          <p className="text-lg">Token Release Schedule</p>
          <p className="text-lg text-tertiary">
            {`${formatWallet(recipient.address)} · ${recipient.percentage}%`}
          </p>
          <p className="text-tertiary text-sm mt-1">Control when your tokens become available.</p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 items-center">
          <p className="text-secondary text-sm">Locked Supply</p>
          <InputField
            value={tokenReleaseForm.lockedSupply.toString()}
            onChangeText={(value) => setTokenReleaseForm(prev => ({ ...prev, lockedSupply: parseInt(value) || 0 }))}
            type="number"
            subfix="%"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5 items-center">
          <p className="text-secondary text-sm">Cliff Period</p>
          <InputField
            value={tokenReleaseForm.cliffPeriod.toString()}
            onChangeText={(value) => setTokenReleaseForm(prev => ({ ...prev, cliffPeriod: parseInt(value) || 0 }))}
            type="number"
            subfix="months"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5 items-center">
          <p className="text-secondary text-sm">Vesting Schedule</p>
          <InputField
            value={tokenReleaseForm.vestingSchedule.toString()}
            onChangeText={(value) => setTokenReleaseForm(prev => ({ ...prev, vestingSchedule: parseInt(value) || 0 }))}
            type="number"
            subfix="months"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5 items-center">
          <p className="text-secondary text-sm">Unlocks</p>
          <Select
            value={tokenReleaseForm.unlocks}
            onChange={(value) => setTokenReleaseForm(prev => ({ ...prev, unlocks: value as 'monthly' | 'daily' }))}
            options={['monthly', 'daily']}
            placeholder="Select frequency"
            removeable={false}
            variant="outlined"
          />
        </div>

        {/* Summary Text */}
        <p className="text-secondary text-sm">
          {tokenReleaseForm.lockedSupply}% of tokens unlock after {tokenReleaseForm.cliffPeriod} months, released {tokenReleaseForm.unlocks === 'monthly' ? 'monthly' : 'daily'} over the next {tokenReleaseForm.vestingSchedule} months.
        </p>

        <Button
          onClick={handleConfirm}
          className="w-full"
          variant="secondary"
        >
          Confirm
        </Button>
      </div>
    </ModalContent>
  );
}
