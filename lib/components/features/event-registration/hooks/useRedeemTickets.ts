import { useMutation } from "$lib/graphql/request";
import { RedeemTicketsDocument } from "$lib/graphql/generated/backend/graphql";
import { toast } from "$lib/components/core";
import { useMe } from "$lib/hooks/useMe";

import { buyerInfoAtom, ethereumWalletInputAtom, eventDataAtom, purchaseItemsAtom, registrationModal, useAtomValue, useEventRegistrationStore, userInfoAtom } from "../store";

import { useJoinRequest } from "./useJoinRequest";
import { useProcessTickets } from "./useProcessTickets";

export const useRedeemTickets = () => {
  const event = useAtomValue(eventDataAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const store = useEventRegistrationStore();

  const me = useMe();
  const handleJoinRequest = useJoinRequest();
  const processTickets = useProcessTickets();

  const [redeem, { loading: loadingRedeem }] = useMutation(RedeemTicketsDocument, {
    onComplete: (_, data) => {
      registrationModal.close();

      if (data.redeemTickets?.join_request?.state === 'pending') {
        handleJoinRequest();
        return;
      }

      processTickets();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const redeemTickets = () => {
    if (!event?._id || !purchaseItems?.length) return;

    const buyerInfo = store.get(buyerInfoAtom);
    const userInfo = store.get(userInfoAtom);
    const ethereumWalletInput = store.get(ethereumWalletInputAtom);

    redeem({
      variables: {
        event: event._id,
        items: purchaseItems,
        buyer_info: buyerInfo || undefined,
        user_info: userInfo ? { ...userInfo, email: me?.email || buyerInfo?.email, display_name: userInfo.display_name || buyerInfo?.name } : undefined,
        connect_wallets: ethereumWalletInput ? [ethereumWalletInput] : undefined,
      }
    });
  };

  return { redeemTickets, loadingRedeem };
};
