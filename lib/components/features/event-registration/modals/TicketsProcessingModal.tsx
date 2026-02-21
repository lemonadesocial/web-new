import { useEffect, useRef } from "react";

import { GetMyTicketsDocument, Ticket } from "$lib/graphql/generated/backend/graphql";
import { useSession } from "$lib/hooks/useSession";
import { useClient } from "$lib/graphql/request";
import { modal, toast } from "$lib/components/core";
import { getErrorMessage } from '$lib/utils/error';

import { eventDataAtom, registrationModal, useAtomValue } from "../store";
import { RegistrationSuccessModal } from "./RegistrationSuccessModal";

export function TicketsProcessingModal() {
  const session = useSession();
  const { client } = useClient();
  const event = useAtomValue(eventDataAtom);

  const retryCountRef = useRef(0);
  const hasOpenedSuccess = useRef(false);

  useEffect(() => {
    if (!session || !event?._id) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const stopPolling = () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    const checkForTickets = async () => {
      try {
        const { data } = await client.query({
          query: GetMyTicketsDocument,
          variables: {
            event: event._id,
            withPaymentInfo: true,
          },
          fetchPolicy: 'network-only',
        });

        const hasTickets = !!data?.getMyTickets?.tickets?.length;

        if (hasTickets && !hasOpenedSuccess.current) { 
          hasOpenedSuccess.current = true;
          stopPolling();
          registrationModal.close();
          modal.open(RegistrationSuccessModal, {
            props: {
              tickets: data.getMyTickets.tickets as Ticket[],
              event
            },
          });

          return true;
        }

        return false;
      } catch (error: unknown) {
      stopPolling();
        registrationModal.close();
        toast.error(getErrorMessage(error, 'Failed to check for tickets. Please try again later.'));
        return false;
      }
    };

    const pollForTickets = async () => {
      const hasTickets = await checkForTickets();

      if (hasTickets) {
        return;
      }

      if (retryCountRef.current >= 2) {
        stopPolling();
        registrationModal.close();
        return;
      }

      retryCountRef.current += 1;
    };

    pollForTickets();

    intervalId = setInterval(pollForTickets, 3000);

    return () => {
      stopPolling();
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
