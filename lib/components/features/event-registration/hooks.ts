import { useMutation } from "$lib/request";
import { GetTicketsDocument, RedeemTicketsDocument } from "$lib/generated/backend/graphql";
import { toast } from "$lib/components/core";
import { eventDataAtom, purchaseItemsAtom, useAtomValue } from "./store";
import { useSession } from "$lib/hooks/useSession";

export const useRedeemTickets = () => {
  const event = useAtomValue(eventDataAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const session = useSession();

  const [redeem, { loading: loadingRedeem }] = useMutation(RedeemTicketsDocument, {
    onComplete: (client, data) => {
      if (data.redeemTickets.join_request?.state === 'pending') {

        return;
      }

      if (session?.user) {
        client.refetchQuery({
          query: GetTicketsDocument,
          variables: { event: event._id, user: session.user },
        });
      }

      toast.success('Tickets redeemed successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const redeemTickets = () => {
    redeem({
      variables: {
        event: event._id,
        items: purchaseItems,
      }
    });
  };

  return { redeemTickets, loadingRedeem };
};
