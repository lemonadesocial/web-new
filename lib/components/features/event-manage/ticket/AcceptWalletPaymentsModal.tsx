"use client";

import React from 'react';

import { Button, ModalContent, modal } from '$lib/components/core';
import { CreateDirectVaultModal } from '$lib/components/features/modals/CreateDirectVaultModal';
import { Event, NewPaymentAccount } from '$lib/graphql/generated/backend/graphql';

import { useUpdateEventPaymentAccounts } from '../hooks';

interface AcceptWalletPaymentsModalProps {
  event: Event;
  onAccept?: () => void;
}

export function AcceptWalletPaymentsModal({ event, onAccept }: AcceptWalletPaymentsModalProps) {
  const { addAccount } = useUpdateEventPaymentAccounts();

  const handleCreateVault = () => {
    modal.close();
    modal.open(CreateDirectVaultModal, {
      props: {
        onCreateVault(paymentAccount: NewPaymentAccount) {
          if (paymentAccount._id) {
            addAccount(paymentAccount._id);

            onAccept?.();
          }
        },
      },
      className: 'overflow-visible',
    });
  };

  return (
    <ModalContent 
      icon="icon-account-balance"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Accept Wallet Payments</p>
          <p className="text-sm text-secondary">
            Create a direct payments vault to start accepting payments in crypto tokens. It's quick, secure, and only takes a minute to set up.
          </p>
        </div>
        
        <Button
          className="w-full"
          variant="secondary"
          onClick={handleCreateVault}
        >
          Create Direct Vault
        </Button>
      </div>
    </ModalContent>
  );
}
