'use client';

import Link from 'next/link';

import type { Space } from '$lib/graphql/generated/backend/graphql';
import { randomCommunityImage } from '$lib/utils/community';
import { generateUrl } from '$lib/utils/cnd';

interface SpaceCardProps {
  data: Space;
  link?: string;
}

export function SpaceCard({ data, link }: SpaceCardProps) {
  const href = link || `/s/${data.slug || data._id}`;
  const avatarUrl = data.image_avatar_expanded
    ? generateUrl(data.image_avatar_expanded, { resize: { width: 38, height: 38, fit: 'cover' } })
    : randomCommunityImage(data._id);

  const stats = data.followers_count != null ? `${data.followers_count} followers` : '';

  return (
    <Link href={href} className="block">
      <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card cursor-pointer">
        <img
          src={avatarUrl}
          alt={data.title ?? ''}
          loading="lazy"
          className="size-[38px] rounded-full object-cover shrink-0 border border-card-border"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {data.title}
          </p>
          <p className="text-sm text-tertiary truncate mt-0.5">
            {stats}
          </p>
          <span
            className={`inline-block text-xs px-1.5 py-0.5 rounded-sm mt-0.5 ${data.private ? 'bg-overlay-primary text-tertiary' : 'bg-green-500/10 text-green-500'}`}
          >
            {data.private ? 'Private' : 'Public'}
          </span>
        </div>
        <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary shrink-0" />
      </div>
    </Link>
  );
}
