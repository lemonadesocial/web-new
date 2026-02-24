import { useEventStatus } from "$lib/hooks/useEventStatus";
import { Event } from "$lib/graphql/generated/backend/graphql";

export function EventCountdown({ event }: { event: Event }) {
  const { status, timeLabel } = useEventStatus(event.start, event.end);

  if ((status !== 'upcoming' && status !== 'starting-soon') || !event.virtual_url) return null;

  return (
    <div className="bg-primary/8 rounded-sm py-2 px-3.5 flex gap-2">
      <i aria-hidden="true" className="icon-clock size-5 text-secondary mt-0.5" />
      <div className="w-full space-y-2">
        <div className="flex justify-between">
          <p className="text-secondary">Event starting in</p>
          <p className="text-warning-300">{timeLabel}</p>
        </div>
        {
          status === 'upcoming' && <>
            <hr className="border-t border-divider" />
            <p className="text-secondary text-sm">
              The join button will be shown when the event is about to start.
            </p>
          </>
        }
      </div>
    </div>
  );
}
