import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

import { toast } from "$lib/components/core";
import { BuyTicketsDocument, StripeAccount, UpdatePaymentDocument } from "$lib/generated/backend/graphql";
import { useMutation } from "$lib/request";

import { buyerInfoAtom, currencyAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, registrationModal, selectedPaymentAccountAtom, stripePaymentMethodAtom, useAtomValue, useEventRegistrationStore, userInfoAtom } from "../store";
import { PaymentProcessingModal } from "../modals/PaymentProcessingModal";
import { useJoinRequest } from "./useJoinRequest";
import { useProcessTickets } from "./useProcessTickets";

export function useCardPayment() {
  const store = useEventRegistrationStore();

  const pricingInfo = useAtomValue(pricingInfoAtom);
  const event = useAtomValue(eventDataAtom);
  const currency = useAtomValue(currencyAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const selectedPaymentAccount = store.get(selectedPaymentAccountAtom);
  const handleJoinRequest = useJoinRequest();
  const processTickets = useProcessTickets();

  const [loadingStripe, setLoadingStripe] = useState(false);

  const paymentAccount = selectedPaymentAccount ? pricingInfo?.payment_accounts?.find(account => account._id === selectedPaymentAccount._id) : pricingInfo?.payment_accounts?.[0];

  const [handleUpdatePayment, { loading: loadingUpdatePayment }] = useMutation(UpdatePaymentDocument, {
    onComplete: async (_, data) => {
      if (data.updatePayment.transfer_metadata.next_action_url) {
        try {
          setLoadingStripe(true);
          const { transfer_metadata } = data.updatePayment;

          const stripe = await loadStripe(transfer_metadata.public_key, { stripeAccount: (paymentAccount?.account_info as StripeAccount)?.account_id });

          if (!stripe) {
            toast.error('Failed to load Stripe. Please try again later.');
            return;
          }

          const result = await stripe.confirmCardPayment(transfer_metadata.client_secret);
          if (result.paymentIntent?.status !== (transfer_metadata.capture_required ? 'requires_capture' : 'succeeded')) {
            const error = result.error?.message || 'Payment authentication failed. Please try again.';
            toast.error(error);
            return;
          }
        } catch {
          toast.error('Failed to process payment. Please try again later.');
          return;
        } finally {
          setLoadingStripe(false);
        }
      }

      if (data.updatePayment.state === 'failed') {
        const error = data.updatePayment.failure_reason || 'Payment failed. Please try again.';
        toast.error(error);
        return;
      }

      registrationModal.close();

      registrationModal.open(PaymentProcessingModal, {
        props: {
          paymentId: data.updatePayment._id,
          paymentSecret: data.updatePayment.transfer_metadata?.payment_secret,
          hasJoinRequest: buyTicketsData?.buyTickets?.join_request?.state === 'pending',
        }
      });
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const [handleBuyTickets, { loading: loadingBuyTickets, data: buyTicketsData }] = useMutation(BuyTicketsDocument, {
    onComplete(_, data) {
      if (pricingInfo?.total === '0') {
        registrationModal.close();

        if (data.buyTickets?.join_request?.state === 'pending') {
          handleJoinRequest();
          return;
        }

        processTickets();
        return;
      }

      const stripeMethod = store.get(stripePaymentMethodAtom);

      handleUpdatePayment({
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
    },
    onError(err) {
      toast.error(err.message);
    }
  });

  const pay = () => {
    const buyerInfo = store.get(buyerInfoAtom);
    const userInfo = store.get(userInfoAtom);

    handleBuyTickets({
      variables: {
        input: {
          account_id: paymentAccount?._id,
          currency: currency,
          // discount: promotionCode || undefined,
          event: event._id,
          items: purchaseItems,
          total: pricingInfo?.total || '0',
          fee: paymentAccount?.fee,
          buyer_info: buyerInfo,
          user_info: userInfo ? { ...userInfo, email: buyerInfo?.email, display_name: buyerInfo?.name } : undefined,
        }
      }
    });
  };

  return { pay, loading: loadingBuyTickets || loadingUpdatePayment || loadingStripe };
}
