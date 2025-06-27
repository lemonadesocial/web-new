
import { Avatar, Button, drawer } from "$lib/components/core";
import { Event, TicketExport } from "$lib/graphql/generated/backend/graphql";
import { randomUserImage } from "$lib/utils/user";
import { format } from "date-fns";

export function GuestDetailsDrawer({ ticketInfo }: { ticketInfo: TicketExport }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex flex-shrink-0">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
        <p>Guest Details</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <Avatar src={ticketInfo.buyer_avatar || randomUserImage(ticketInfo.buyer_email?.toString())} className="size-8" />
            <div>
              <p>{ticketInfo.buyer_name}</p>
              <p className="text-sm text-secondary">{ticketInfo.buyer_email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <p className="text-tertiary text-sm">Registration Time</p>
              <p>{format(new Date(ticketInfo.purchase_date), 'MMM d \'at\' h:mm a')}</p>
            </div>
            <div className="w-1 h-[44px] border-l border-l-divider" />
            <div>
              <p className="text-tertiary text-sm">Ticket</p>
              <p>{ticketInfo.ticket_type}</p>
            </div>
          </div>
        </div>

        <hr className="border-t border-t-divider" />
      </div>
      <div className="px-4 py-3 border-t border-t-divider flex-shrink-0">
        {/* footer */}
      </div>
    </div>
  );
}
