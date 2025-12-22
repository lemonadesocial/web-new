'use client';

import { useState } from 'react';
import { Button, modal, Radiobox, ModalContent, toast, Skeleton } from '$lib/components/core';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { CancelTicketsDocument, ListEventTicketTypesDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { ReplaceTicketModal } from './ReplaceTicketModal';

interface PurchasedTicket {
  _id: string;
  type_expanded?: {
    _id: string;
    title: string;
  } | null;
}

export function ModifyTicketsModal({
  purchasedTickets,
  event,
  onComplete,
}: {
  purchasedTickets: PurchasedTicket[];
  event: string;
  onComplete?: () => void;
}) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(purchasedTickets[0]?._id || null);

  const { data, loading } = useQuery(ListEventTicketTypesDocument, {
    variables: { event },
  });

  const ticketTypes = data?.listEventTicketTypes || [];
  const canReplace = ticketTypes.length > 1;

  const [cancelTickets] = useMutation(CancelTicketsDocument, {
    onComplete: () => {
      toast.success('Tickets canceled successfully');
      modal.close();
      onComplete?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cancel tickets');
    },
  });

  return (
    <ModalContent
      icon="icon-ticket"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">Modify Tickets</p>
          {loading ? (
            <Skeleton className="h-4 w-full rounded-full" animate />
          ) : (
            <p className="text-sm text-secondary">
              {canReplace ? 'Cancel existing tickets or replace them with another ticket type.' : 'Cancel existing tickets.'}
            </p>
          )}
        </div>

        <div className="rounded-sm border-card-border bg-card divide-y divide-(--color-divider)">
          {purchasedTickets.map((ticket, index) => (
            <div
              key={ticket._id}
              className="flex items-center p-3 cursor-pointer gap-2"
              onClick={() => setSelectedTicketId(ticket._id)}
            >
              <p className="text-tertiary">#{index + 1}</p>
              <p className="flex-1">
                {ticket.type_expanded?.title || 'Unknown'}
              </p>
              <Radiobox
                id={`ticket-${ticket._id}`}
                name="ticket"
                value={selectedTicketId === ticket._id}
                onChange={() => setSelectedTicketId(ticket._id)}
                containerClass="flex-row-reverse gap-3"
              >
                <span className="hidden" />
              </Radiobox>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-sm" animate />
            <Skeleton className="h-10 flex-1 rounded-sm" animate />
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="danger"
              outlined
              className={canReplace ? 'flex-1' : 'w-full'}
              disabled={!selectedTicketId}
              onClick={() => {
                if (!selectedTicketId) return;

                modal.open(ConfirmModal, {
                  props: {
                    title: 'Cancel Tickets?',
                    subtitle: 'The selected tickets will be canceled. Any other tickets for this guest will remain active.',
                    icon: 'icon-remove-ticket',
                    onConfirm: async () => {
                      await cancelTickets({
                        variables: {
                          input: {
                            event,
                            tickets: [selectedTicketId],
                          },
                        },
                      });
                    },
                    buttonText: 'Confirm',
                  },
                });
              }}
            >
              Cancel
            </Button>
            {canReplace && (
              <Button
                variant="secondary"
                className="flex-1"
                disabled={!selectedTicketId}
                onClick={() => {
                  if (!selectedTicketId) return;

                  const selectedTicket = purchasedTickets.find((t) => t._id === selectedTicketId);
                  if (!selectedTicket) return;

                  modal.open(ReplaceTicketModal, {
                    props: {
                      ticket: selectedTicket,
                      event,
                      onComplete: () => {
                        modal.close();
                        onComplete?.();
                      },
                      onBack: () => {
                        modal.close();
                      },
                    },
                    className: 'overflow-visible'
                  });
                }}
              >
                Replace
              </Button>
            )}
          </div>
        )}
      </div>
    </ModalContent>
  );
}

