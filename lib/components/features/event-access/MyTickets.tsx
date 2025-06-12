import { useMemo } from "react";

import { Ticket, Event, PaymentRefundInfo } from '$lib/graphql/generated/backend/graphql';
import { Button, drawer, modal } from "$lib/components/core";
import { downloadTicketPass, getAssignedTicket, getUnassignedTickets } from "$lib/utils/event";
import { useEventStatus } from "$lib/hooks/useEventStatus";
import { useMe } from "$lib/hooks/useMe";

import { AccessCard } from "./AccessCard";
import { StakeRefundItem } from "./StakeRefund";
import { MyTicketsPane } from "./MyTicketsPane";
import { AddToCalendarModal } from "./AddToCalendar";
import { AdditionalTicketsPane } from "./AdditionalTicketsPane";
import { EventCountdown } from "./EventCountdown";
import { InviteFriendModal } from "../modals/InviteFriendModal";

export function MyTickets({ tickets, payments, event }: { tickets: Ticket[]; payments?: PaymentRefundInfo[]; event: Event; }) {
  const me = useMe();

  const { status } = useEventStatus(event.start, event.end);

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

  const refundPayments = payments?.filter(p => p.refund_policy?.requirements?.checkin_before && !p.attempting_refund);
  const myTicket = getAssignedTicket(tickets, me?._id, me?.email) || tickets[0];
  const unassignedTickets = getUnassignedTickets(tickets);

  if (status === 'ended') return (
    <AccessCard event={event}>
      <div>
        <h3 className="text-xl font-semibold">Thank You for Joining</h3>
        <p className="text-lg text-tertiary">Tickets: {ticketTypeText}</p>
        <p className="text-secondary">We hope you enjoyed the event!</p>
      </div>
    </AccessCard>
  );

  return (
    <AccessCard event={event}>
      <div>
        <h3 className="text-xl font-semibold">You&apos;re In</h3>
        <p className="text-lg text-tertiary">Tickets: {ticketTypeText}</p>
      </div>
      <EventCountdown event={event} />
      <div className="flex justify-between whitespace-nowrap flex-wrap gap-2">
        <div className="flex gap-2">
          {
            status === 'upcoming' && <>
              <Button
                variant="tertiary"
                size="sm"
                iconLeft="icon-calendar-add"
                onClick={() => modal.open(AddToCalendarModal, {
                  props: {
                    event
                  },
                  dismissible: true
                })}
              >
                Add to Calendar
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                icon="icon-ticket"
                onClick={() => drawer.open(MyTicketsPane, {
                  props: {
                    tickets,
                    event
                  },
                })}
              />
            </>
          }
          {
            (status === 'starting-soon' || status === 'live') && (
              event.virtual_url ? <>
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft="icon-video"
                  onClick={() => window.open(event.virtual_url!, '_blank')}
                >
                  Join Event
                </Button>
                {
                  event.address && (
                    <Button
                      variant="tertiary"
                      size="sm"
                      icon="icon-ticket"
                      onClick={() => drawer.open(MyTicketsPane, {
                        props: {
                          tickets,
                          event
                        },
                      })}
                    />
                  )
                }
              </> : (
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft="icon-ticket"
                  onClick={() => drawer.open(MyTicketsPane, {
                    props: {
                      tickets,
                      event
                    },
                  })}
                >
                  My Ticket
                </Button>
              )
            )
          }
          {
            (!event.virtual_url || event.address) && (
              <Button
                variant="tertiary"
                size="sm"
                iconLeft="icon-pass"
                onClick={() => downloadTicketPass(myTicket)}
              />
            )
          }
        </div>
        <div className="flex gap-2">
          {
            unassignedTickets.length > 0 && (
              <Button
                variant="tertiary"
                size="sm"
                iconLeft="icon-assign-ticket"
                onClick={() => drawer.open(AdditionalTicketsPane, {
                  props: {
                    tickets
                  },
                })}
              >
                Assign ({unassignedTickets.length})
              </Button>
            )
          }
          <Button
            variant="tertiary"
            size="sm"
            iconLeft="icon-share"
            onClick={() => modal.open(InviteFriendModal, {
              props: {
                event
              },
              dismissible: true
            })}
          >
            Invite a Friend
          </Button>
        </div>
      </div>
      {
        !!refundPayments?.length && (
          <>
            <hr className="border-t border-divider" />
            <div className="space-y-2">
              {
                refundPayments.map(payment => (
                  <StakeRefundItem key={payment._id} payment={payment} />
                ))
              }
            </div>
          </>
        )
      }
    </AccessCard>
  );
}
