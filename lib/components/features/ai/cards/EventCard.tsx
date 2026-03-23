'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

import { randomEventDP } from '$lib/utils/user';
import { Event } from '$lib/graphql/generated/backend/graphql';

interface EventCardProps {
  data: Event;
  link?: string;
}

export function EventCard({ data, link }: EventCardProps) {
  const href = link || `/e/${data.shortid}`;
  const dateStr = data.start
    ? format(new Date(data.start), "EEE, d MMM 'at' h:mm a")
    : '';

  return (
    <Link href={href} className="block">
      <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card cursor-pointer">
        <Image
          src={data.cover ?? randomEventDP()}
          alt={data.title ?? ''}
          width={38}
          height={38}
          className="rounded-sm border border-card-border object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p>{data.title}</p>
          <p className="text-sm text-tertiary">{dateStr}</p>
        </div>
        <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary shrink-0" />
      </div>
    </Link>
  );
}
