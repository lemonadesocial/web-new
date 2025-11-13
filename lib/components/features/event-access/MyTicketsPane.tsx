import { QRCodeSVG } from 'qrcode.react';

import { Button, drawer, modal } from "$lib/components/core";
import { Ticket, Event } from "$lib/graphql/generated/backend/graphql";
import { useMe } from "$lib/hooks/useMe";
import { getAssignedTicket, getUnassignedTickets } from '$lib/utils/event';

import { AddToCalendarModal } from "./AddToCalendar";
import { AdditionalTicketsPane } from './AdditionalTicketsPane';
import { AddToWalletModal } from './AddToWallet';

export function MyTicketsPane({ tickets, event }: { tickets: Ticket[]; event: Event; }) {
  const me = useMe();
  const myTicket = getAssignedTicket(tickets, me?._id, me?.email) || tickets[0];
  const additionalTickets = tickets.filter(ticket => ticket.assigned_to !== me?._id && ticket.assigned_email !== me?.email);
  const unassignedTickets = getUnassignedTickets(additionalTickets);

  return (
    <div>
      <div className="px-3 py-2 border-b border-b-divider">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-xl font-semibold">My Tickets</h3>
          <p className="mt-1 text-secondary">All your tickets, receipts, and actions in one place.</p>
          <div className="rounded-md border border-card-border bg-card mt-4">
            <div className="pt-11 px-4 pb-9 flex justify-center border-b border-b-divider">
              <QRCodeSVG
                value={myTicket.shortid}
                size={280}
                bgColor="transparent"
                fgColor="white"
              />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="tertiary"
                  size="sm"
                  iconLeft="icon-calendar-add"
                  onClick={() => modal.open(AddToCalendarModal, {
                    props: {
                      event
                    },
                  })}
                >
                  Add to Calendar
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  iconLeft="icon-pass"
                  onClick={() => {
                    modal.open(AddToWalletModal, {
                      props: {
                        ticket: myTicket
                      },
                    });
                  }}
                >
                  Download Pass
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-lg">{event.title}</p>
                <div className="flex">
                  <div className="flex-1">
                    <p className="text-sm text-tertiary">Name</p>
                    <p>{me?.name}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-tertiary">Email</p>
                    <p>{me?.email}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-tertiary">Ticket</p>
                  <p>{myTicket.type_expanded?.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {additionalTickets.length > 0 && (
          <div
            className="flex items-center gap-3 p-3 rounded-md bg-card border border-card-border cursor-pointer"
            onClick={() => drawer.open(AdditionalTicketsPane, { props: { tickets }})}
          >
            <i className="icon-ticket-noti text-xl text-tertiary" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{additionalTickets.length} Additional Tickets</p>
                {unassignedTickets.length > 0 && (
                   <div className="px-[6px] py-[1px] bg-warning-300/16 rounded-full">
                     <p className="text-xs text-warning-300 leading-4.5">{unassignedTickets.length} unassigned</p>
                   </div>
                )}
              </div>
              <p className="text-sm text-tertiary">Manage tickets you bought for others.</p>
            </div>
            <i className="icon-chevron-right text-tertiary" />
          </div>
        )}
      </div>
    </div>
  );
}
