
import { toast } from "$lib/components/core";
import { BuyTicketsDocument } from "$lib/generated/backend/graphql";
import { useMutation } from "$lib/request";

import { buyerInfoAtom, currencyAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, registrationModal, selectedPaymentAccountAtom, useAtomValue, useEventRegistrationStore, userInfoAtom } from "../store";
import { ConfirmCryptoPaymentModal } from "../modals/ConfirmCryptoPaymentModal";
import { useJoinRequest } from "./useJoinRequest";
import { useProcessTickets } from "./useProcessTickets";

export function useCryptoPayment() {
  const store = useEventRegistrationStore();

  const pricingInfo = useAtomValue(pricingInfoAtom);
  const event = useAtomValue(eventDataAtom);
  const currency = useAtomValue(currencyAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const selectedPaymentAccount = useAtomValue(selectedPaymentAccountAtom);
  const handleJoinRequest = useJoinRequest();
  const processTickets = useProcessTickets();

  const paymentAccount = selectedPaymentAccount ? pricingInfo?.payment_accounts?.find(account => account._id === selectedPaymentAccount._id) : pricingInfo?.payment_accounts?.[0];

  const [handleBuyTickets, { loading: loadingBuyTickets }] = useMutation(BuyTicketsDocument, {
    onComplete: async (_, data) => {
      if (pricingInfo?.total === '0') {
        registrationModal.close();

        if (data.buyTickets?.join_request?.state === 'pending') {
          handleJoinRequest();
          return;
        }

        processTickets();
        return;
      }

      registrationModal.open(ConfirmCryptoPaymentModal, {
        props: {
          paymentId: data.buyTickets.payment._id,
          paymentSecret: data.buyTickets.payment.transfer_metadata.payment_secret,
          hasJoinRequest: data.buyTickets.join_request?.state === 'pending'
        },
        dismissible: true
      });
    },
    onError(err) {
      toast.error(err.message);
    }
  });

  const pay = () => {
    // TODO: check balance
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

  return { pay, loading: loadingBuyTickets };
}
