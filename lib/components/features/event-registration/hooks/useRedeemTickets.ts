import { useMutation } from "$lib/request";
import { RedeemTicketsDocument } from "$lib/generated/backend/graphql";
import { toast } from "$lib/components/core";

import { buyerInfoAtom, eventDataAtom, purchaseItemsAtom, useAtomValue, useEventRegistrationStore, userInfoAtom } from "../store";
import { useMe } from "$lib/hooks/useMe";
import { useJoinEvent } from "./useJoinEvent";

export const useRedeemTickets = () => {
  const event = useAtomValue(eventDataAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const store = useEventRegistrationStore();

  const me = useMe();
  const joinEvent = useJoinEvent();

  const [redeem, { loading: loadingRedeem }] = useMutation(RedeemTicketsDocument, {
    onComplete: (client, data) => {
      joinEvent(data.redeemTickets?.join_request?.state === 'pending');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const redeemTickets = () => {
    if (!event?._id || !purchaseItems?.length) return;

    const buyerInfo = store.get(buyerInfoAtom);
    const userInfo = store.get(userInfoAtom);

    redeem({
      variables: {
        event: event._id,
        items: purchaseItems,
        buyer_info: buyerInfo || undefined,
        user_info: userInfo ? { ...userInfo, email: me?.email || buyerInfo?.email, display_name: userInfo.display_name || buyerInfo?.name } : undefined,
      }
    });
  };

  return { redeemTickets, loadingRedeem };
};
