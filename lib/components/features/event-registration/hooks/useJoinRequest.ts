import { modal } from "$lib/components/core";
import { GetMyEventJoinRequestDocument } from "$lib/graphql/generated/backend/graphql";
import { useSession } from "$lib/hooks/useSession";
import { useClient } from "$lib/graphql/request";
import { RequestSentModal } from "../modals/RequestSentModal";

import { eventDataAtom, nonLoggedInStatusAtom, registrationModal, useAtomValue, useSetAtom } from "../store";

export function useJoinRequest() {
  const session = useSession();
  const { client } = useClient();

  const event = useAtomValue(eventDataAtom);
  const setNonLoggedInStatus = useSetAtom(nonLoggedInStatusAtom);

  return () => {
    modal.open(RequestSentModal);

    if (session) {
      client.refetchQuery({
        query: GetMyEventJoinRequestDocument,
        variables: { event: event._id },
      });

      return;
    }

    registrationModal.close();
    setNonLoggedInStatus('pending');
  }
}
