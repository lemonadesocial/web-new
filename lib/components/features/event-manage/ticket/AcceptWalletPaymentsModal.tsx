"use client";

import React from 'react';

import { Button, ModalContent, modal } from '$lib/components/core';
import { CreateDirectVaultModal } from '$lib/components/features/modals/CreateDirectVaultModal';
import { Event, NewPaymentAccount, UpdateEventPaymentAccountsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useUpdateEvent } from '../store';

interface AcceptWalletPaymentsModalProps {
  event: Event;
}

export function AcceptWalletPaymentsModal({ event }: AcceptWalletPaymentsModalProps) {
  const updateEvent = useUpdateEvent();

  const [updatePaymentAccount] = useMutation(UpdateEventPaymentAccountsDocument, {
    onComplete(_, data) {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent as Event);
        modal.close();
        
        // modal.open(TokenDetailsModal, {
        //   props: {
        //     ticketType: initialTicketType._id,
        //     event: event?._id,
        //   },
        // });
      }
    },
  });

  const handleCreateVault = () => {
    modal.close();
    modal.open(CreateDirectVaultModal, {
      props: {
        onCreateVault(paymentAccount: NewPaymentAccount) {
          if (paymentAccount._id) {
            updatePaymentAccount({
              variables: {
                id: event._id,
                payment_accounts_new: [...(event.payment_accounts_new || []), paymentAccount._id]
              }
            });
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
