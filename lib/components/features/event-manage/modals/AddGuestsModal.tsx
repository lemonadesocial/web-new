import { useState } from 'react';

import { modal, Button, toast, Menu, MenuItem } from '$lib/components/core';
import { Event as EventType, EventTicketType, CreateTicketsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';

export function AddGuestsModal({
  emails,
  event,
  onBack,
  title = 'Invite Guests',
  onSelectInvite,
}: {
  emails: string[];
  event: EventType;
  onBack: () => void;
  title?: string;
  onSelectInvite?: () => void;
}) {
  const [selectedTicketType, setSelectedTicketType] = useState<EventTicketType | undefined>(
    event.event_ticket_types?.[0],
  );

  const [createTickets, { loading }] = useMutation(CreateTicketsDocument);

  const handleSendInvites = async () => {
    if (!selectedTicketType) {
      toast.error('Please select a ticket type');
      return;
    }

    try {
      await createTickets({
        variables: {
          ticketType: selectedTicketType._id,
          ticketAssignments: emails.map((email) => ({
            email,
            count: 1,
          })),
        },
      });
      toast.success('Guests added successfully!');
      window.dispatchEvent(new Event('refetch_guest_list'));
      modal.close();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add guests');
    }
  };

  return (
    <div className="max-w-full w-[448px]">
      <div className="flex justify-between py-3 px-4 border-b">
        <p className="text-lg">{title}</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} aria-label="Close" />
      </div>
      <div className="p-4 space-y-4">
        <div className="py-2.5 px-3.5 rounded-sm border bg-card">
          <p className="text-sm text-tertiary">
            Inviting {emails.length} {emails.length === 1 ? 'guest' : 'guests'}
          </p>
          <p className="truncate">{emails.join(', ')}</p>
        </div>

        <div className="py-2.5 px-3.5 rounded-sm border bg-card space-y-3.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center justify-center size-6 bg-primary/6 rounded-full">
                <span className="text-sm text-tertiary">{index + 1}</span>
              </div>
              <div className="flex flex-1">
                <div className="w-1/3 h-3.5 rounded-xs bg-primary/8" />
              </div>
              <div className="px-2.5 py-[1px] rounded-xs bg-success-500/16">
                <span className="text-sm text-success-500">Going</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-[34px] rounded-sm bg-success-500/16">
            <i aria-hidden="true" className="icon-person-add text-success-500 size-4.5" />
          </div>
          <p className="flex-1 text-sm">Guests will be added to the guest list, bypassing registration and payment.</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm">Ticket Type</p>
          <Menu.Root className="w-full">
            <Menu.Trigger className="flex items-center justify-between rounded-sm border bg-background/64 px-2.5 py-2 w-full">
              <p className="truncate">{selectedTicketType?.title || 'Select a ticket type'}</p>
              <i aria-hidden="true" className="text-quaternary icon-chevron-down size-5" />
            </Menu.Trigger>
            <Menu.Content className="w-full p-1 overflow-auto max-h-40">
              {({ toggle }) => (
                <div className="space-y-1">
                  {event.event_ticket_types?.map((ticket) => (
                    <MenuItem
                      key={ticket._id}
                      title={ticket.title}
                      onClick={() => {
                        setSelectedTicketType(ticket);
                        toggle();
                      }}
                    />
                  ))}
                </div>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>

        <div>
          <p className="text-sm text-tertiary">
            If you&apos;d like guests to register, send them an invite.{' '}
            <button type="button" className="text-accent-500 cursor-pointer inline" onClick={onSelectInvite}>
              Invite Guests
            </button>
          </p>
          <p className="text-sm text-tertiary">
            Please only add guests who have already consented to joining this event.
          </p>
        </div>
      </div>
      <div className="flex justify-between py-3 px-4 border-t items-center">
        <Button iconLeft="icon-chevron-left" variant="tertiary" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button iconLeft="icon-person-add" variant="secondary" onClick={handleSendInvites} loading={loading}>
          Add to Guest List
        </Button>
      </div>
    </div>
  );
}
