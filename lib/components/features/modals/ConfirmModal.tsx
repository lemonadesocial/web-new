'use client';
import React from 'react';
import { Button, modal } from '$lib/components/core';

export function ConfirmModal({
  title,
  subtitle,
  onConfirm,
}: {
  onConfirm: () => Promise<void> | void;
  title: string;
  subtitle: string;
}) {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[308px]">
      <div className="p-3 rounded-full bg-danger-400/16 w-fit">
        <i className="icon-info text-danger-400" />
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
