import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

import { toast } from "$lib/components/core";
import { StripeAccount, UpdatePaymentDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";

import { pricingInfoAtom, registrationModal, selectedPaymentAccountAtom, stripePaymentMethodAtom, useAtomValue, useEventRegistrationStore } from "../store";
import { PaymentProcessingModal } from "../modals/PaymentProcessingModal";
import { useBuyTickets } from "./useBuyTickets";

export function useCardPayment() {
  const store = useEventRegistrationStore();
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const selectedPaymentAccount = store.get(selectedPaymentAccountAtom);

  const [loadingStripe, setLoadingStripe] = useState(false);

  const paymentAccount = selectedPaymentAccount ? pricingInfo?.payment_accounts?.find(account => account._id === selectedPaymentAccount._id) : pricingInfo?.payment_accounts?.[0];

  const [handleUpdatePayment, { loading: loadingUpdatePayment }] = useMutation(UpdatePaymentDocument);
  
  const { pay, loading: loadingBuyTickets } = useBuyTickets(async (data) => {
    const stripeMethod = store.get(stripePaymentMethodAtom);

    try {
      const { data: updatePaymentData } = await handleUpdatePayment({
        variables: {
          input: {
            _id: data.buyTickets.payment?._id,
            payment_secret: data.buyTickets.payment?.transfer_metadata?.payment_secret,
            transfer_params: {
              return_url: window.location.href,
              payment_method: stripeMethod,
            }
          }
        }
      });

      if (updatePaymentData?.updatePayment?.transfer_metadata?.next_action_url) {
        setLoadingStripe(true);
        const { transfer_metadata } = updatePaymentData.updatePayment;

        const stripe = await loadStripe(transfer_metadata.public_key, { stripeAccount: (paymentAccount?.account_info as StripeAccount)?.account_id });

        if (!stripe) {
          toast.error('Failed to load Stripe. Please try again later.');
          return;
        }

        const result = await stripe.confirmCardPayment(transfer_metadata.client_secret);
        if (result.paymentIntent?.status !== (transfer_metadata.capture_required ? 'requires_capture' : 'succeeded')) {
          throw new Error(result.error?.message || 'Payment authentication failed. Please try again.');
        }

        setLoadingStripe(false);
      }

      if (updatePaymentData?.updatePayment?.state === 'failed') {
        throw new Error(updatePaymentData?.updatePayment?.failure_reason || 'Payment failed. Please try again.');
      }

      registrationModal.close();

      registrationModal.open(PaymentProcessingModal, {
        props: {
          paymentId: updatePaymentData?.updatePayment?._id,
          paymentSecret: updatePaymentData?.updatePayment?.transfer_metadata?.payment_secret,
          hasJoinRequest: data?.buyTickets?.join_request?.state === 'pending'
        },
        dismissible: false
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingStripe(false);
    }
  });

  return { pay, loading: loadingBuyTickets || loadingUpdatePayment || loadingStripe };
}
