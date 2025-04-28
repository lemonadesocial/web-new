import { toast } from "$lib/components/core";
import { BuyTicketsDocument, BuyTicketsMutation } from "$lib/generated/backend/graphql";
import { useMutation } from "$lib/request";

import { buyerInfoAtom, currencyAtom, discountCodeAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, registrationModal, selectedPaymentAccountAtom, useAtomValue, useEventRegistrationStore, userInfoAtom } from "../store";
import { useJoinRequest } from "./useJoinRequest";
import { useProcessTickets } from "./useProcessTickets";

export function useBuyTickets(callback?: (data: BuyTicketsMutation) => void) {
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

      callback?.(data);
    },
    onError(err) {
      toast.error(err.message);
    }
  });

  const pay = () => {
    // TODO: check balance
    const buyerInfo = store.get(buyerInfoAtom);
    const userInfo = store.get(userInfoAtom);
    const discountCode = store.get(discountCodeAtom);

    handleBuyTickets({
      variables: {
        input: {
          account_id: paymentAccount?._id,
          currency: currency,
          discount: discountCode,
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
