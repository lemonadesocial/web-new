import { useEffect, useState } from "react";
import { GetTicketsDocument } from "$lib/generated/backend/graphql";
import { useSession } from "$lib/hooks/useSession";
import { useClient } from "$lib/request";
import { eventDataAtom, registrationModal, useAtomValue } from "../store";

export function TicketsProcessingModal() {
  const session = useSession();
  const { client } = useClient();
  const event = useAtomValue(eventDataAtom);

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!session?.user || !event?._id) return;

    const checkForTickets = async () => {
      try {
        const { data } = await client.query({
          query: GetTicketsDocument,
          variables: {
            event: event._id,
            user: session.user,
          },
          fetchPolicy: 'network-only',
        });

        const hasTickets = !!data?.getTickets?.length;

        if (hasTickets) {
          // Tickets found, close the modal
          registrationModal.close();
          return true;
        }

        return false;
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        return false;
      }
    };

    const pollForTickets = async () => {
      const hasTickets = await checkForTickets();

      if (hasTickets || retryCount >= 2) {
        registrationModal.close();
        return;
      }

      setRetryCount(prev => prev + 1);
    };

    pollForTickets();

    const intervalId = setInterval(pollForTickets, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
        <i className="icon-loader animate-spin" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">Issuing tickets</p>
        <p className="text-sm text-secondary">
          Your tickets are being securely issued. Please wait while we complete this process.
        </p>
      </div>
    </div>
  );
}
