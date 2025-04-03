import React from 'react';
import { Avatar, Divider } from '$lib/components/core';
import { Event } from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import Link from 'next/link';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';

export function HostedBySection({ event }: { event: Event }) {
  if (!event) return null;

  const hosts = [event?.host_expanded, ...(event?.visible_cohosts_expanded || [])];

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">Hosted by</p>
      <Divider className="h-1 w-full mb-2" />
      {hosts.map((u) => (
        <div key={u?._id} className="flex gap-3">
          {u?.new_photos_expanded && <Avatar src={generateUrl(u?.new_photos_expanded[0])} />}
          <Link className="hover:text-accent-400" href={`${LEMONADE_DOMAIN}/u/${u?.username}`} target="_blank">
            {u?.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
