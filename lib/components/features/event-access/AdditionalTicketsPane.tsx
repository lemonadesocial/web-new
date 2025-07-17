import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

import { Button, drawer, Input, modal, ModalContent, toast } from '$lib/components/core';
import { AssignTicketsDocument, GetMyTicketsDocument, Ticket } from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';
import { downloadTicketPass, formatPrice } from '$lib/utils/event';
import { EMAIL_REGEX } from '$lib/utils/regex';
import { useMutation } from '$lib/graphql/request';

export function AdditionalTicketsPane({ tickets }: { tickets: Ticket[] }) {
  const me = useMe();
  const additionalTickets = tickets.filter(
    (ticket) => ticket.assigned_to !== me?._id && ticket.assigned_email !== me?.email,
  );

  return (
    <div>
      <div className="px-3 py-2 border-b border-b-divider">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">
          {additionalTickets.length} Additional {additionalTickets.length === 1 ? 'ticket' : 'tickets'}
        </h3>
        <p className="mt-1 text-secondary">View, assign, and access all tickets you purchased for guests.</p>
        <div className="mt-4 space-y-4">
          {additionalTickets.map((ticket) => (
            <div key={ticket._id} className="rounded-md border border-card-border bg-card py-3 px-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p>{ticket.type_expanded?.title}</p>
                  {ticket.assigned_to_expanded ? (
                    <p className="text-sm text-secondary">
                      <span className="text-tertiary">Assigned to:</span> {ticket.assigned_to_expanded.name}
                    </p>
                  ) : (
                    <p className="text-sm italic text-warning-300">Unassigned</p>
                  )}
                </div>
                {ticket.type_expanded?.prices[0] && <p>{formatPrice(ticket.type_expanded?.prices[0])}</p>}
              </div>
              <hr className="border-t border-t-divider" />
              <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="tertiary"
                    size="sm"
                    iconLeft="icon-qr"
                    onClick={() => modal.open(ViewQRModal, { props: { ticket } })}
                  >
                    View QR
                  </Button>
                  <Button variant="tertiary" size="sm" iconLeft="icon-pass" onClick={() => downloadTicketPass(ticket)}>
                    Download Pass
                  </Button>
                </div>
                {!ticket.assigned_to && !ticket.assigned_email && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => modal.open(AssignTicketModal, { dismissible: false, props: { ticket } })}
                  >
                    Assign
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssignTicketModal({ ticket }: { ticket: Ticket }) {
  const [email, setEmail] = useState('');

  const [assignTickets, { loading: isLoading }] = useMutation(AssignTicketsDocument, {
    onComplete: (client, data) => {
      if (data?.assignTickets) {
        modal.close();
        toast.success('Ticket assigned successfully!');

        client.refetchQuery({
          query: GetMyTicketsDocument,
          variables: { event: ticket.event, withPaymentInfo: true },
        });
      } else {
        toast.error('Failed to assign ticket. Please try again.');
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAssign = () => {
    if (!email.trim()) return;

    if (!EMAIL_REGEX.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    assignTickets({
      variables: {
        input: {
          event: ticket.event,
          assignees: [
            {
              ticket: ticket._id,
              email: email,
            },
          ],
        },
      },
    });
  };

  return (
    <ModalContent icon="icon-assign-ticket">
      <p className="text-lg">Assign Ticket</p>
      <p className="mt-2 text-secondary text-sm">
        Enter guest details to send this ticket. They&apos;ll receive it by email and can check in directly.
      </p>

      <div className="mt-2 py-2.5 px-3.5 rounded-sm border border-divider bg-card">
        <div className="text-sm">{ticket.type_expanded?.title}</div>
        <div className="text-tertiary text-xs">
          {ticket.type_expanded?.prices[0] ? formatPrice(ticket.type_expanded.prices[0]) : 'Free'}
        </div>
      </div>

      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mt-3"
      />

      <Button
        onClick={handleAssign}
        variant="secondary"
        loading={isLoading}
        className="mt-4 w-full"
        disabled={!email.trim()}
      >
        Assign
      </Button>
    </ModalContent>
  );
}

function ViewQRModal({ ticket }: { ticket: Ticket }) {
  const isAssigned = !!(ticket.assigned_to_expanded || ticket.assigned_email);

  return (
    <ModalContent className="p-0">
      <div className="flex items-center justify-center px-4 pt-11 pb-9">
        <QRCodeSVG value={ticket._id} size={200} fgColor="#FFFFFF" bgColor="transparent" />
      </div>
      <div className="border-t border-dashed border-divider" />
      <div className="p-4 space-y-2">
        <p className="text-lg">{ticket.event_expanded?.title}</p>

        {!isAssigned ? (
          <div>
            <p className="text-xs text-tertiary">Guest Details</p>
            <p className="italic text-warning-300">To Be Assigned</p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            <div>
              <p className="text-xs text-tertiary">Name</p>
              <p className="truncate">{ticket.assigned_to_expanded?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-tertiary">Email</p>
              <p className="truncate">{ticket.assigned_email || ticket.assigned_to_expanded?.email}</p>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-400">Ticket</p>
          <p className="font-medium">{ticket.type_expanded?.title}</p>
        </div>
      </div>
    </ModalContent>
  );
}
