import { AcceptEventDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";
import { useSession } from "$lib/hooks/useSession";
import { TicketsProcessingModal } from "../modals/TicketsProcessingModal";
import { buyerInfoAtom, eventDataAtom, nonLoggedInStatusAtom, registrationModal, useAtomValue, useEventRegistrationStore, useSetAtom } from "../store";

export function useProcessTickets() {
  const session = useSession();
  const setNonLoggedInStatus = useSetAtom(nonLoggedInStatusAtom);
  const [acceptEvent] = useMutation(AcceptEventDocument);
  const event = useAtomValue(eventDataAtom);
  const store = useEventRegistrationStore();

  return () => {
    if (session?.user) {
      registrationModal.open(TicketsProcessingModal);
      return;
    }

    registrationModal.close();
    setNonLoggedInStatus('success');

    const buyerInfo = store.get(buyerInfoAtom);
    acceptEvent({
      variables: {
        id: event._id,
        email: buyerInfo?.email,
      },
    });
  }
}
