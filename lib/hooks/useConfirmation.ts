'use client';

import React from 'react';

import { modal } from '$lib/components/core';
import { ConfirmModal } from '$lib/components/features/modals/ConfirmModal';

type ConfirmationOptions = {
  title: string;
  subtitle: string;
  onConfirm: () => Promise<void> | void;
  icon?: string;
  buttonText?: string;
};

export function useConfirmation() {
  return React.useCallback((options: ConfirmationOptions) => {
    modal.open(ConfirmModal, {
      props: options,
    });
  }, []);
}
