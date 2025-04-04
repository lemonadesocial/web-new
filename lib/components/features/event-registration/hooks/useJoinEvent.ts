import { GetMyEventJoinRequestDocument, GetTicketsDocument } from "$lib/generated/backend/graphql";
import { useSession } from "$lib/hooks/useSession";
import { useClient } from "$lib/request";
import { eventDataAtom, nonLoggedInStatusAtom, registrationModal, useAtomValue, useSetAtom } from "../store";

export function useJoinEvent() {
  const session = useSession();
  const { client } = useClient();

  const event = useAtomValue(eventDataAtom);
  const setNonLoggedInStatus = useSetAtom(nonLoggedInStatusAtom);

  return (pending: boolean) => {
    registrationModal.close();

    if (pending) {
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
  }
}
