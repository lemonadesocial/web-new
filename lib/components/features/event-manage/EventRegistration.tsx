'use client';
import { LimitsAndRestrictions } from "./registration/LimitsAndRestrictions";
import { RegistrationForm } from "./registration-form/RegistrationForm";
import { useEvent } from "./store";
import { TicketList } from "./registration/TicketList";
import { CouponList } from "./registration/CouponList";
import { RegistrationEmails } from "./registration/RegistrationEmails";

export function EventRegistration() {
  const event = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      <LimitsAndRestrictions event={event} />
      <TicketList event={event} />
      <hr className="border-t border-t-divider" />
      <CouponList event={event} />
      <hr className="border-t border-t-divider" />
      <RegistrationEmails event={event} />
      <hr className="border-t border-t-divider" />
      <RegistrationForm />
    </div>
  );
}
