'use client';

import Link from 'next/link';
import { format } from 'date-fns';

import type { Ticket } from '$lib/graphql/generated/backend/graphql';

interface TicketCardProps {
  data: Ticket;
  link?: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-500/10 text-green-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
};

export function TicketCard({ data, link }: TicketCardProps) {
  const eventTitle = data.event_expanded?.title;
  const eventStart = data.event_expanded?.start;
  const shortid = data.event_expanded?.shortid;
  const ticketTypeTitle = data.type_expanded?.title ?? 'General Admission';
  const isUnavailable = !eventTitle && !shortid;
  const href = link || (shortid ? `/e/${shortid}` : `#`);
  const dateStr = eventStart
    ? format(new Date(eventStart), "EEE, d MMM 'at' h:mm a")
    : '';
  const status = data.checkin?.active ? 'confirmed' : 'pending';
  const statusStyle =
    STATUS_STYLES[status] || 'bg-overlay-primary text-tertiary';

  if (isUnavailable) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card opacity-50 pointer-events-none">
        <i aria-hidden="true" className="icon-ticket size-5 text-tertiary shrink-0" />
        <p className="text-sm text-tertiary">Event unavailable</p>
      </div>
    );
  }

  return (
    <Link href={href} className="block">
      <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card cursor-pointer">
        <i aria-hidden="true" className="icon-ticket size-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {ticketTypeTitle}
          </p>
          <p className="text-sm text-tertiary truncate mt-0.5">
            {[eventTitle, dateStr].filter(Boolean).join(' \u00B7 ')}
          </p>
          <span
            className={`inline-block text-xs px-1.5 py-0.5 rounded-sm mt-0.5 capitalize ${statusStyle}`}
          >
            {status}
          </span>
        </div>
        <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary shrink-0" />
      </div>
    </Link>
  );
}
