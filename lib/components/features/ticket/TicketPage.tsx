import type { ReactNode } from 'react';

import type { GetTicketQuery } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { formatWithTimezone } from '$lib/utils/date';
import {
  getEventAddress,
  getEventGoogleMapsUrl,
  getTicketEventStatus,
  getTicketPassUrl,
  type TicketEventStatus,
} from '$lib/utils/event';

import { TicketActions, TicketQrCode } from './TicketActions';

type Ticket = NonNullable<GetTicketQuery['getTicket']>;

const STATUS_META: Record<TicketEventStatus, { label: string; className: string }> = {
  upcoming: {
    label: 'Upcoming',
    className: 'text-primary',
  },
  going: {
    label: 'Going',
    className: 'text-success-300',
  },
  ended: {
    label: 'Ended',
    className: 'text-warning-300',
  },
  unknown: {
    label: 'Unknown',
    className: 'text-tertiary',
  },
};

function DetailItem({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-sm text-tertiary">{label}</dt>
      <dd className="mt-1 break-words text-lg font-medium leading-6 text-primary">{children}</dd>
    </div>
  );
}

export function TicketPage({ ticket }: { ticket: Ticket }) {
  const event = ticket.event_expanded;
  const status = getTicketEventStatus(event);
  const statusMeta = STATUS_META[status];
  const eventStart = event ? new Date(event.start) : null;
  const eventDate = eventStart ? formatWithTimezone(eventStart, 'MMM dd, yyyy', event?.timezone) : null;
  const eventTime = eventStart ? formatWithTimezone(eventStart, 'h:mm a OOO', event?.timezone) : null;
  const addressText = getEventAddress(event?.address ?? undefined);
  const mapUrl = getEventGoogleMapsUrl(event);
  const guestName =
    ticket.assigned_to_expanded?.display_name ||
    ticket.assigned_to_expanded?.name ||
    ticket.assigned_email ||
    'Anonymous';

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8 text-primary">
      <section className="w-full max-w-[540px] overflow-hidden rounded-[2rem] border border-card-border bg-card shadow-2xl shadow-black/25">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5">
              <p className="text-sm font-medium text-primary">Ticket</p>
            </div>
            <img src={`${ASSET_PREFIX}/assets/images/lemonade-logo.png`} alt="Lemonade" className="h-6 w-auto" />
          </div>

          {event ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold leading-8 tracking-[-0.03em] text-primary sm:text-3xl sm:leading-10">
                {event.title}
              </h1>
              {eventDate && eventTime ? (
                <p className="text-sm text-tertiary">
                  {eventDate}
                  <span className="mx-2 text-quaternary">·</span>
                  {eventTime}
                </p>
              ) : null}
              {addressText ? (
                <p className="whitespace-pre-line text-sm leading-6 text-tertiary">{addressText}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="border-t border-divider" />
        <TicketQrCode shortid={ticket.shortid} />

        <dl className="grid gap-5 border-t border-divider p-6">
          <div className="grid grid-cols-2 gap-5">
            <DetailItem label="Guest">{guestName}</DetailItem>
            <DetailItem label="Status">
              <span className={statusMeta.className}>{statusMeta.label}</span>
            </DetailItem>
          </div>
          <DetailItem label="Ticket">{ticket.type_expanded?.title || 'General Admission'}</DetailItem>
        </dl>

        <div className="border-t border-divider" />
        <TicketActions
          mapUrl={mapUrl}
          appleWalletUrl={getTicketPassUrl(ticket, 'apple')}
          googleWalletUrl={getTicketPassUrl(ticket, 'google')}
        />
      </section>
    </main>
  );
}

export function TicketNotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(250,204,21,0.14),transparent_34%)]" />
      <section className="relative w-full max-w-md rounded-[2rem] border border-card-border bg-card p-8 text-center shadow-2xl shadow-black/25">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-white/8">
          <i aria-hidden="true" className="icon-ticket text-2xl text-tertiary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">Ticket not found</h1>
        <p className="mt-2 text-sm leading-6 text-tertiary">
          Check the ticket link and try again. If it was shared with you, ask the organizer for a fresh link.
        </p>
      </section>
    </main>
  );
}
