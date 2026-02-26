'use client';
import { useState, useMemo, useEffect } from 'react';

import { Button, modal, ModalContent, Menu, MenuItem, toast } from '$lib/components/core';
import { ListEventTicketTypesDocument, UpgradeTicketDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery, useMutation } from '$lib/graphql/request';
import { formatPrice } from '$lib/utils/event';

interface PurchasedTicket {
  _id: string;
  type_expanded?: {
    _id: string;
    title: string;
  } | null;
}

export function ReplaceTicketModal({
  ticket,
  event,
  onComplete,
  onBack,
}: {
  ticket: PurchasedTicket;
  event: string;
  onComplete?: () => void;
  onBack?: () => void;
}) {
  const { data } = useQuery(ListEventTicketTypesDocument, {
    variables: { event },
  });

  const ticketTypes = data?.listEventTicketTypes || [];
  const currentTicketTypeId = ticket.type_expanded?._id;
  
  const availableTicketTypes = useMemo(() => {
    return ticketTypes.filter((ticketType) => ticketType._id !== currentTicketTypeId);
  }, [ticketTypes, currentTicketTypeId]);

  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(null);

  useEffect(() => {
    if (availableTicketTypes.length > 0 && !selectedTicketTypeId) {
      setSelectedTicketTypeId(availableTicketTypes[0]._id);
    }
  }, [availableTicketTypes, selectedTicketTypeId]);
  const currentTicketTypeFromList = ticketTypes.find((t) => t._id === currentTicketTypeId);
  const currentPrice = currentTicketTypeFromList?.prices?.[0];
  const currentPriceFormatted = currentPrice ? formatPrice(currentPrice as any, true) : 'Free';

  const [upgradeTicket, { loading }] = useMutation(UpgradeTicketDocument, {
    onComplete: () => {
      toast.success('Ticket replaced successfully');
      modal.close();
      onComplete?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upgrade ticket');
    },
  });

  const handleSave = () => {
    upgradeTicket({
      variables: {
        input: {
          event,
          ticket: ticket._id,
          to_type: selectedTicketTypeId,
        },
      },
    });
  };

  return (
    <ModalContent
      title="Replace Ticket"
      onClose={() => modal.close()}
      onBack={onBack}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-2 rounded-sm bg-primary/8">
          <i aria-hidden="true" className="icon-ticket size-5 text-tertiary" />
          </div>
          <div>
            <p className="font-medium">{ticket.type_expanded?.title || 'Unknown'}</p>
            <p className="text-sm text-secondary">{currentPriceFormatted}</p>
          </div>
        </div>

        <hr className="border-t -mx-4" />

        <div className="space-y-1.5">
          <p className="text-sm text-tertiary">Select Replacement Ticket</p>
          <Menu.Root placement="bottom-start" className="w-full">
            <Menu.Trigger className="flex items-center px-3.5 py-2 rounded-sm border border-divider cursor-pointer bg-background/64 w-full min-w-0">
              <span className="font-medium flex-1 text-left truncate min-w-0">
                {selectedTicketTypeId ? ticketTypes.find((t) => t._id === selectedTicketTypeId)?.title : 'Select ticket type'}
              </span>
              <i aria-hidden="true" className="icon-chevron-down size-5 text-tertiary flex-shrink-0" />
            </Menu.Trigger>
            <Menu.Content className="w-full p-1 max-h-[200px] overflow-auto no-scrollbar">
              {({ toggle }) => (
                <>
                  {availableTicketTypes.map((ticketType) => {
                      const price = ticketType.prices?.[0];
                      const priceFormatted = price ? formatPrice(price as any, true) : 'Free';

                      return (
                        <MenuItem
                          key={ticketType._id}
                          onClick={() => {
                            setSelectedTicketTypeId(ticketType._id);
                            toggle();
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <i aria-hidden="true" className="icon-ticket size-4 text-tertiary flex-shrink-0" />
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <p className="text-sm text-secondary truncate">{ticketType.title}</p>
                                <p className="text-xs text-tertiary">{priceFormatted}</p>
                              </div>
                          </div>
                          {selectedTicketTypeId === ticketType._id && <i aria-hidden="true" className="icon-check size-4 text-primary" />}
                        </MenuItem>
                      );
                    })}
                </>
              )}
            </Menu.Content>
          </Menu.Root>

          <p className="text-sm text-secondary pt-0.5">This won't require payment from the guest.</p>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleSave}
          disabled={!selectedTicketTypeId || selectedTicketTypeId === currentTicketTypeId}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>
    </ModalContent>
  );
}

