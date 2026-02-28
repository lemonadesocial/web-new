'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '$lib/components/core';
import { type SpaceCardData, getLetterPlaceholder } from './utils';

interface SpaceCardProps {
  data: SpaceCardData;
  link?: string;
}

export function SpaceCard({ data, link }: SpaceCardProps) {
  const href = link || `/s/${data.slug || data._id}`;
  const placeholder = getLetterPlaceholder(data.title || '');

  const stats = [
    data.member_count != null && `${data.member_count} members`,
    data.event_count != null && `${data.event_count} events`,
  ]
    .filter(Boolean)
    .join(' \u00B7 ');

  return (
    <Link href={href} className="block">
      <Card.Root className="flex items-center gap-3 p-3 cursor-pointer">
        {data.image_avatar_url ? (
          <Image
            src={data.image_avatar_url}
            alt={data.title}
            width={40}
            height={40}
            loading="lazy"
            className="size-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className={`${placeholder.bgColor} size-10 rounded-full shrink-0 flex items-center justify-center text-white font-semibold`}
          >
            {placeholder.letter}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {data.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-sm ${data.private ? 'bg-overlay-primary text-tertiary' : 'bg-green-500/10 text-green-500'}`}
            >
              {data.private ? 'Private' : 'Public'}
            </span>
            {stats && <span className="text-xs text-tertiary">{stats}</span>}
          </div>
        </div>
      </Card.Root>
    </Link>
  );
}
