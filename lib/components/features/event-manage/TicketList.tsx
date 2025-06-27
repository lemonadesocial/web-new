import { Button, drawer } from "$lib/components/core";
import { Event, EventTicketType, ListEventTicketTypesDocument } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { formatPrice } from "$lib/utils/event";
import { TicketTypeDrawer } from "./ticket/TicketTypeDrawer";

export function TicketList({ event }: { event: Event }) {
  const { data } = useQuery(ListEventTicketTypesDocument, {
    variables: {
      event: event._id
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tickets</h1>
        <Button
          variant="tertiary"
          size="sm"
          iconLeft="icon-plus"
          onClick={() => drawer.open(TicketTypeDrawer)}
        >
          Add Ticket Type
        </Button>
      </div>

      <div className="rounded-md border border-card-border bg-card divide-y divide-(--color-divider)">
        {data?.listEventTicketTypes.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket as EventTicketType} />
        ))}
      </div>
    </div>
  );
}

function TicketItem({ ticket }: { ticket: EventTicketType }) {
  return (
    <div
      className="flex justify-between items-center px-4 py-3 cursor-pointer"
      onClick={() => drawer.open(TicketTypeDrawer, {
        props: {
          ticketType: ticket
        }
      })}
    >
      <div className="flex gap-2">
        <p>{ticket.title}</p>
        <p className="text-tertiary">
          {formatPrice(ticket.prices[0], true)}
        </p>
      </div>

      <div className="flex gap-1.5 items-center">
        <i className="icon-user-group-outline size-5 text-tertiary" />
        <p className="text-tertiary">
          {ticket.ticket_limit ? `${ticket.ticket_count || 0}/${ticket.ticket_limit}` : ticket.ticket_count || 0}
        </p>
      </div>
    </div>
  );
}