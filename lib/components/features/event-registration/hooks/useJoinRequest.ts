import { modal } from "$lib/components/core";
import { GetMyEventJoinRequestDocument } from "$lib/generated/backend/graphql";
import { useSession } from "$lib/hooks/useSession";
import { useClient } from "$lib/request";
import { RequestSentModal } from "../modals/RequestSentModal";

import { eventDataAtom, nonLoggedInStatusAtom, useAtomValue, useSetAtom } from "../store";

export function useJoinRequest() {
  const session = useSession();
  const { client } = useClient();

  const event = useAtomValue(eventDataAtom);
  const setNonLoggedInStatus = useSetAtom(nonLoggedInStatusAtom);

  return () => {
    modal.open(RequestSentModal, { dismissible: true });

    if (session?.user) {
      client.refetchQuery({
        query: GetMyEventJoinRequestDocument,
        variables: { event: event._id },
      });

      return;
    }

    setNonLoggedInStatus('pending');
  }
}
