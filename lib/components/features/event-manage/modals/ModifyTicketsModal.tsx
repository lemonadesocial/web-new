'use client';

import { useState } from 'react';
import { Button, modal, Radiobox, ModalContent } from '$lib/components/core';

interface PurchasedTicket {
  _id: string;
  type_expanded?: {
    _id: string;
    title: string;
  } | null;
}

export function ModifyTicketsModal({
  purchasedTickets,
}: {
  purchasedTickets: PurchasedTicket[];
}) {
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(null);

  return (
    <ModalContent
      icon="icon-ticket"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">Modify Tickets</p>
          <p className="text-sm text-secondary">
            Cancel existing tickets or replace them with another ticket type.
          </p>
        </div>

        <div className="rounded-sm border-card-border bg-card divide-y divide-(--color-divider)">
          {purchasedTickets.map((ticket, index) => (
            <div
              key={ticket._id}
              className="flex items-center p-3 cursor-pointer gap-2"
              onClick={() => ticket.type_expanded?._id && setSelectedTicketTypeId(ticket.type_expanded._id)}
            >
              <p className="text-tertiary">#{index + 1}</p>
              <p className="flex-1">
                {ticket.type_expanded?.title || 'Unknown'}
              </p>
              <Radiobox
                id={`ticket-type-${ticket._id}`}
                name="ticket-type"
                value={selectedTicketTypeId === ticket.type_expanded?._id}
                onChange={() => ticket.type_expanded?._id && setSelectedTicketTypeId(ticket.type_expanded._id)}
                containerClass="flex-row-reverse gap-3"
              >
                <span className="hidden" />
              </Radiobox>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="danger"
            outlined
            className="flex-1"
            onClick={() => modal.close()}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            disabled={!selectedTicketTypeId}
          >
            Replace
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}

