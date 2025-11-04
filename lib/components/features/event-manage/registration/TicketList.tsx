import { Button, Chip, drawer } from '$lib/components/core';
import {
  Event,
  EventTicketType,
  ListEventTicketTypesDocument,
  ListEventTokenGatesDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { formatPrice } from '$lib/utils/event';
import { TicketTypeDrawer } from '../ticket/TicketTypeDrawer';

export function TicketList({ event }: { event: Event }) {
  const { data } = useQuery(ListEventTicketTypesDocument, {
    variables: {
      event: event._id,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tickets</h1>
        <Button variant="tertiary" size="sm" iconLeft="icon-plus" onClick={() => drawer.open(TicketTypeDrawer)}>
          Add Ticket Type
        </Button>
      </div>

      <div className="rounded-md border border-card-border bg-card divide-y divide-(--color-divider)">
        {data?.listEventTicketTypes.map((ticket) => <TicketItem key={ticket._id} ticket={ticket as EventTicketType} />)}
      </div>
    </div>
  );
}

function TicketItem({ ticket }: { ticket: EventTicketType }) {
  const { data: tokenGatesData } = useQuery(ListEventTokenGatesDocument, {
    variables: { event: ticket.event, ticketTypes: [ticket._id] },
  });

  return (
    <div
      className="flex justify-between items-center px-4 py-3 cursor-pointer gap-2"
      onClick={() =>
        drawer.open(TicketTypeDrawer, {
          props: {
            ticketType: ticket,
          },
        })
      }
    >
      <div className="flex gap-3 items-center">
        {ticket?.photos_expanded?.[0] && (
          <img src={generateUrl(ticket.photos_expanded?.[0] as any)} className="size-5 aspect-square rounded-xs" />
        )}

        <div className="flex gap-2 flex-1 items-center">
          <p>{ticket.title}</p>
          <p className="text-tertiary">{formatPrice(ticket.prices[0], true)}</p>
          {!!tokenGatesData?.listEventTokenGates.length && (
            <Chip variant="primary" size="xxs" className="rounded-full">
              Token Exclusive
            </Chip>
          )}
        </div>
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
