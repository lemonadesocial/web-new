import { useMemo } from "react";

import { Ticket } from '$lib/generated/backend/graphql';

import { AccessCard } from "./AccessCard";

export function MyTickets({ tickets }: { tickets: Ticket[] }) {
  const ticketTypeText = useMemo(() => {
    const ticketTypes = tickets.reduce((acc, ticket) => {
      const typeId = ticket.type;
      if (!acc[typeId]) {
        acc[typeId] = {
          count: 0,
          title: ticket.type_expanded?.title || ''
        };
      }
      acc[typeId].count++;
      return acc;
    }, {} as Record<string, { count: number; title: string }>);

    return Object.values(ticketTypes)
      .map(({ count, title }) => `${count}x ${title}`)
      .join(', ');
  }, [tickets]);

  return (
    <AccessCard>
      <div>
        <h3 className="text-xl font-semibold">You&apos;re In</h3>
        <p className="text-lg text-tertiary">{ticketTypeText}</p>
      </div>
    </AccessCard>
  );
}
