import { useMemo, useState } from "react";

import { Ticket, Event, PaymentRefundInfo } from '$lib/graphql/generated/backend/graphql';
import { Button, drawer, modal, ModalContent } from "$lib/components/core";
import { downloadTicketPass, getAssignedTicket, getUnassignedTickets } from "$lib/utils/event";
import { useEventStatus } from "$lib/hooks/useEventStatus";
import { useMe } from "$lib/hooks/useMe";

import { AccessCard } from "./AccessCard";
import { StakeRefundItem } from "./StakeRefund";
import { MyTicketsPane } from "./MyTicketsPane";
import { AddToCalendarModal } from "./AddToCalendar";
import { AdditionalTicketsPane } from "./AdditionalTicketsPane";
import { EventCountdown } from "./EventCountdown";

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

function InviteFriendModal({ event }: { event: Event }) {
  const [copyText, setCopyText] = useState('Copy');
  const shareUrl = `${window.location.origin}/e/${event.shortid}`;
  const shareText = `I am going to ${event.title}. Join me!`;

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopyText('Copied!');
      });
  };

  const shareOptions = [
    { name: 'Tweet', icon: 'icon-twitter', onClick: () => handleShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`) },
    { name: 'Cast', icon: 'icon-warpcast', onClick: () => handleShare(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`) },
    { name: 'Post', icon: 'icon-linkedin', onClick: () => handleShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`) },
    { name: 'Share', icon: 'icon-facebook', onClick: () => handleShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`) },
    { name: 'Email', icon: 'icon-email', onClick: () => handleShare(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`) },
    ...(navigator.share ? [{
      name: 'Native',
      icon: 'icon-share',
      onClick: () => navigator.share({
        title: event.title,
        text: shareText,
        url: shareUrl
      })
    }] : [])
  ];

  return (
    <ModalContent icon="icon-share" className="w-[480px]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Invite a Friend</p>
          <p className="text-sm text-secondary">It&apos;s always more fun with friends. We&apos;ll let you know when your friends accept your invite.</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {shareOptions.map((option) => (
            <ShareButton
              key={option.icon}
              title={option.name}
              icon={option.icon}
              onClick={option.onClick}
            />
          ))}
        </div>
        <hr className="border-t border-divider" />
        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Share the link:</p>
          <div className="flex items-center gap-2">
            <div className="flex-grow rounded-sm border border-primary/8 bg-woodsmoke-950/64 py-2 px-3 overflow-hidden">
              <p className="truncate">{shareUrl}</p>
            </div>
            <Button
              variant="tertiary"
              onClick={handleCopy}
            >
              {copyText}
            </Button>
          </div>
        </div>
      </div>
    </ModalContent>
  );
}

interface ShareButtonProps {
  title: string;
  icon: string;
  onClick: () => void;
}

function ShareButton({ title, icon, onClick }: ShareButtonProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 px-1 py-4 rounded-sm bg-primary/8 cursor-pointer"
    >
      <i className={`${icon} size-8 text-secondary`} />
      <span className="text-sm text-secondary">{title}</span>
    </div>
  );
}
