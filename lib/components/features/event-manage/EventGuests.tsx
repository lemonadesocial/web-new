'use client';

import { GuestList } from "./GuestList";
import { useEvent } from "./store";
import { PendingApprovalsOverview } from "./PendingApprovalsOverview";

export function EventGuests() {
  const event = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      <PendingApprovalsOverview event={event} />
      <GuestList event={event} />
    </div>
  );
}
