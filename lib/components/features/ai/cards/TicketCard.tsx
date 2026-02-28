'use client';

import Link from 'next/link';
import { Card } from '$lib/components/core';
import { type TicketCardData, formatDate } from './utils';

interface TicketCardProps {
  data: TicketCardData;
  link?: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-500/10 text-green-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
};

export function TicketCard({ data, link }: TicketCardProps) {
  const isUnavailable = !data.event_title;
  const href = link || `/e/${data.event_id}`;
  const dateStr = formatDate(data.event_start);
  const statusStyle =
    STATUS_STYLES[data.status] || 'bg-overlay-primary text-tertiary';

  if (isUnavailable) {
    return (
      <Card.Root className="flex items-center gap-3 p-3 opacity-50 pointer-events-none">
        <i aria-hidden="true" className="icon-ticket size-5 text-tertiary" />
        <p className="text-sm text-tertiary">Event unavailable</p>
      </Card.Root>
    );
  }

  return (
    <Link href={href} className="block">
      <Card.Root className="flex items-center gap-3 p-3 cursor-pointer">
        <i aria-hidden="true" className="icon-ticket size-5 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {data.ticket_type_title || 'General Admission'}
          </p>
          <p className="text-xs text-tertiary truncate mt-0.5">
            {[data.event_title, dateStr].filter(Boolean).join(' \u00B7 ')}
          </p>
          <span
            className={`inline-block text-xs px-1.5 py-0.5 rounded-sm mt-0.5 ${statusStyle}`}
          >
            {data.status}
          </span>
        </div>
      </Card.Root>
    </Link>
  );
}
