import { useMemo, useState } from "react";

import { Ticket, Event, EventCalendarLinks, PaymentRefundInfo } from '$lib/generated/backend/graphql';
import { Button, modal, ModalContent } from "$lib/components/core";

import { AccessCard } from "./AccessCard";
import { StakeRefundItem } from "./StakeRefund";

export function MyTickets({ tickets, payments }: { tickets: Ticket[]; payments?: PaymentRefundInfo[]; event: Event; }) {
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

  return (
    <AccessCard>
      <div>
        <h3 className="text-xl font-semibold">You&apos;re In</h3>
        <p className="text-lg text-tertiary">{ticketTypeText}</p>
      </div>
      <div className="flex justify-between">
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

function AddToCalendarModal({ event }: { event: Event }) {
  const addToCalendar = (calendar: keyof EventCalendarLinks) => {
    window.open(
      `${event.calendar_links![calendar]}`,
      '_blank'
    )
  };

  return (
    <ModalContent icon="icon-calendar-add">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Add to Calendar</p>
          <p className="text-sm text-secondary">On registration, we sent you an email that should&apos;ve added an event to your calendar.</p>
          <p className="text-sm text-secondary">You can also click on one of the buttons to manually add the event to your calendar.</p>
        </div>
        <div className="space-y-2">
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-blue-400/16"
            onClick={() => addToCalendar('google')}
          >
            <i className="icon-google size-5 text-blue-400" />
            <p className="text-blue-400">Google Calendar</p>
          </div>
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-violet-400/16"
            onClick={() => addToCalendar('yahoo')}
          >
            <i className="icon-yahoo size-5 text-accent-400" />
            <p className="text-accent-400">Yahoo</p>
          </div>
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-amber-400/16"
            onClick={() => addToCalendar('google')}
          >
            <i className="icon-microsoft size-5 text-warning-300" />
            <p className="text-warning-300">Outlook.com</p>
          </div>
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-primary/8"
            onClick={() => addToCalendar('ical')}
          >
            <i className="icon-calendar-add size-5 text-tertiary" />
            <p className="text-tertiary">iCal (Apple / Outlook)</p>
          </div>
        </div>
      </div>
    </ModalContent>
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
