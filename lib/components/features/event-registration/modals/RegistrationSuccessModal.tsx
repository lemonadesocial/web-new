import { Button, drawer, modal } from "$lib/components/core";
import { MyTicketsPane } from "../../event-access/MyTicketsPane";

import { Ticket, Event } from "$lib/graphql/generated/backend/graphql";

export function RegistrationSuccessModal({
  tickets,
  event
}: { tickets: Ticket[]; event: Event; }) {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-success-500/16">
        <i className="icon-done text-success-500" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">You’re in!</p>
        <p className="text-sm text-secondary">Your registration is confirmed. You can view your event details and any tickets in your account at any time.</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="tertiary"
          onClick={() => {
            modal.close();

            drawer.open(MyTicketsPane, {
              props: {
                tickets,
                event
              },
            });
          }}
          className="w-full"
        >
          View Tickets
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            modal.close();
          }}
          className="w-full"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
