'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '$lib/components/core';
import { type EventCardData, getLetterPlaceholder, formatDate } from './utils';

interface EventCardProps {
  data: EventCardData;
  link?: string;
}

export function EventCard({ data, link }: EventCardProps) {
  const href = link || `/e/${data.shortid}`;
  const dateStr = formatDate(data.start);
  const placeholder = getLetterPlaceholder(data.title || '');

  return (
    <Link href={href} className="block">
      <Card.Root className="flex items-center gap-3 p-3 cursor-pointer">
        {data.cover ? (
          <Image
            src={data.cover}
            alt={data.title}
            width={48}
            height={48}
            loading="lazy"
            className="size-12 rounded-sm object-cover shrink-0"
          />
        ) : (
          <div
            className={`${placeholder.bgColor} size-12 rounded-sm shrink-0 flex items-center justify-center text-white font-semibold text-lg`}
          >
            {placeholder.letter}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full shrink-0 ${data.published ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
            <p className="text-sm font-medium text-primary truncate">{data.title}</p>
          </div>
          <p className="text-xs text-tertiary truncate mt-0.5">
            {[dateStr, data.address].filter(Boolean).join(' \u00B7 ')}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-sm ${data.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}
            >
              {data.published ? 'Published' : 'Draft'}
            </span>
            {data.attending_count != null && (
              <span className="text-xs text-tertiary">
                {data.attending_count} attending
              </span>
            )}
          </div>
        </div>
      </Card.Root>
    </Link>
  );
}
