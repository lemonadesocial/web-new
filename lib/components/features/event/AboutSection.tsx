import React from 'react';
import './AboutSection.css';

import { Event } from '$lib/generated/backend/graphql';
import { Divider } from '$lib/components/core';

export function AboutSection({ event }: { event: Event }) {
  if (!event.description) return null;

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">About</p>
      <Divider className="h-1 w-full mb-2" />
      <div dangerouslySetInnerHTML={{ __html: event.description }} />
    </div>
  );
}
