import { useEffect } from 'react';

import { GetNewPaymentDocument, NewPaymentState } from '$lib/generated/backend/graphql';
import { toast } from '$lib/components/core';
import { useClient } from "$lib/request";

import { registrationModal } from "../store";
import { useProcessTickets } from '../hooks/useProcessTickets';
import { useJoinRequest } from '../hooks/useJoinRequest';

interface PaymentProcessingModalProps {
  paymentId: string;
  paymentSecret?: string;
  hasJoinRequest: boolean;
}

export function PaymentProcessingModal({ paymentId, paymentSecret, hasJoinRequest }: PaymentProcessingModalProps) {
  const processTickets = useProcessTickets();
  const handleJoinRequest = useJoinRequest();
  const { client } = useClient();

  useEffect(() => {
    if (!paymentId) return;

    const checkPaymentStatus = async () => {
      try {
        const { data } = await client.query({
          query: GetNewPaymentDocument,
          variables: {
            id: paymentId,
            paymentSecret
          },
          fetchPolicy: 'network-only',
        });

        if (!data?.getNewPayment) return false;

        const { state, failure_reason } = data.getNewPayment;

        if (failure_reason) {
          toast.error(failure_reason || 'Payment failed. Please try again.');
          registrationModal.close();
          return true;
        }

        if (state === NewPaymentState.Succeeded || state === NewPaymentState.AwaitCapture) {
          registrationModal.close();

          if (hasJoinRequest) {
            handleJoinRequest();
            return true;
          }

          processTickets();
          return true;
        }

        return false;
      } catch (error: any) {
        registrationModal.close();
        toast.error(error.message || 'Failed to check payment status');
        return false;
      }
    };

    checkPaymentStatus();

    const intervalId = setInterval(async () => {
      const shouldStopPolling = await checkPaymentStatus();
      if (shouldStopPolling) {
        clearInterval(intervalId);
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [paymentId, paymentSecret, client, processTickets]);

  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
        <i className="icon-loader animate-spin" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">Processing Payment</p>
        <p className="text-sm text-secondary">
          We&apos;re securing your payment details. This may take a moment.
        </p>
      </div>
    </div>
  );
}
