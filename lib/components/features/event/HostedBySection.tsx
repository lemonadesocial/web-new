import React from 'react';
import { Divider } from '$lib/components/core';
import { Event } from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';

export function HostedBySection({ event }: { event: Event }) {
  const hosts = [event.host_expanded, ...(event.visible_cohosts_expanded || [])];
  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">Hosted by</p>
      <Divider className="h-1 w-full mb-2" />
      {hosts.map((u) => (
        <div key={u?._id}>
          {u?.new_photos_expanded && <img src={generateUrl(u?.new_photos_expanded)} />}
          <p>{u?.name}</p>
        </div>
      ))}
    </div>
  );
}
