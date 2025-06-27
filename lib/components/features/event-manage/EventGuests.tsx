'use client';

import { GuestList } from "./GuestList";
import { useEvent } from "./store";

export function EventGuests() {
  const event = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      <GuestList event={event} />
    </div>
  );
}
