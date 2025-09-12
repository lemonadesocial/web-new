'use client';
import React from 'react';
import { Button, modal } from '$lib/components/core';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ConfirmModal({
  title,
  subtitle,
  onConfirm,
  icon = 'icon-info',
}: {
  onConfirm: () => Promise<void> | void;
  title: string;
  subtitle: string;
  icon?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[308px]">
      <div className="p-3 rounded-full bg-danger-400/16 size-[56px] aspect-square">
        <i className={twMerge('text-danger-400 size-8 aspect-square', icon)} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm font-medium text-secondary">{subtitle}</p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          className="flex-1"
          onClick={() => {
            modal.close();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await onConfirm();
            setLoading(false);
            modal.close();
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
