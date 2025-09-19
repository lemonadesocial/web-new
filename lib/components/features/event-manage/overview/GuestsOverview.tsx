import { Event } from "$lib/graphql/generated/backend/graphql";
import { PendingApprovalsOverview } from "../common/PendingApprovalsOverview";
import { RecentRegistrations } from "./RecentRegistrations";
import { GuestStats } from "../common/GuestStats";

export function GuestsOverview({ event }: { event: Event }) {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Guests</h1> 
      <GuestStats event={event} />
      <PendingApprovalsOverview event={event} titleClassName="text-lg font-body font-medium" />
      <RecentRegistrations event={event} titleClassName="text-lg font-body font-medium" />
    </div>
  );
}
