import { useMutation } from "$lib/request";
import { GetMyEventJoinRequestDocument, GetTicketsDocument, RedeemTicketsDocument } from "$lib/generated/backend/graphql";
import { toast } from "$lib/components/core";
import { useSession } from "$lib/hooks/useSession";

import { buyerInfoAtom, eventDataAtom, nonLoggedInStatusAtom, purchaseItemsAtom, registrationModal, useAtomValue, useSetAtom, useEventRegistrationStore } from "./store";

export const useRedeemTickets = () => {
  const event = useAtomValue(eventDataAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const session = useSession();
  const setNonLoggedInStatus = useSetAtom(nonLoggedInStatusAtom);
  const store = useEventRegistrationStore();

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

    // Get latest buyerInfo directly from store
    const buyerInfo = store.get(buyerInfoAtom);

    redeem({
      variables: {
        event: event._id,
        items: purchaseItems,
        buyer_info: buyerInfo || undefined
      }
    });
  };

  return { redeemTickets, loadingRedeem };
};
