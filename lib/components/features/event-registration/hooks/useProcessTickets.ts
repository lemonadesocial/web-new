import { useSession } from "$lib/hooks/useSession";
import { TicketsProcessingModal } from "../modals/TicketsProcessingModal";
import { nonLoggedInStatusAtom, registrationModal, useSetAtom } from "../store";

export function useProcessTickets() {
  const session = useSession();
  const setNonLoggedInStatus = useSetAtom(nonLoggedInStatusAtom);

  return () => {
    if (session?.user) {
      registrationModal.open(TicketsProcessingModal);
      return;
    }

    setNonLoggedInStatus('success');
  }
}
