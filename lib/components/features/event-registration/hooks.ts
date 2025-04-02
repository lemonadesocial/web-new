import { useMutation } from "$lib/request";
import { GetMyEventJoinRequestDocument, GetTicketsDocument, RedeemTicketsDocument } from "$lib/generated/backend/graphql";
import { toast } from "$lib/components/core";
import { useSession } from "$lib/hooks/useSession";

import { buyerInfoAtom, eventDataAtom, nonLoggedInStatusAtom, purchaseItemsAtom, registrationModal, useAtomValue, useSetAtom, useEventRegistrationStore, userInfoAtom } from "./store";
import { useMe } from "$lib/hooks/useMe";

export const useRedeemTickets = () => {
  const event = useAtomValue(eventDataAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const setNonLoggedInStatus = useSetAtom(nonLoggedInStatusAtom);
  const store = useEventRegistrationStore();

  const me = useMe();
  const session = useSession();

  const [redeem, { loading: loadingRedeem }] = useMutation(RedeemTicketsDocument, {
    onComplete: (client, data) => {
      registrationModal.close();

      if (data.redeemTickets.join_request?.state === 'pending') {
        if (session?.user) {
          client.refetchQuery({
            query: GetMyEventJoinRequestDocument,
            variables: { event: event._id },
          });

          return;
        }

        setNonLoggedInStatus('pending');
        return;
      }

      if (session?.user) {
        client.refetchQuery({
          query: GetTicketsDocument,
          variables: { event: event._id, user: session.user },
        });

        return;
      }

      setNonLoggedInStatus('success');
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
