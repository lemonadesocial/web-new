'use client';
import { LimitsAndRestrictions } from "./LimitsAndRestrictions";
import { useEvent } from "./store";
import { TicketList } from "./TicketList";

export function EventRegistration() {
  const event = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      <LimitsAndRestrictions event={event} />
      <TicketList event={event} />
    </div>
  );
}
