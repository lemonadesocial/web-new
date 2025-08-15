import { format } from 'date-fns';
import { convertFromUtcToTimezone, formatWithTimezone } from '$lib/utils/date';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { modal, toast } from '$lib/components/core';
import { ScheduleFeedbackModal } from '../modals/EventBlastsModal';

export function EventRecap({ event }: { event: Event }) {
  const formatEventDate = (dateString: string, timezone?: string) => {
    const startTime = convertFromUtcToTimezone(dateString, timezone);
    return format(startTime, 'EEEE, MMM d');
  };

  const formatEventTime = (dateString: string, timezone?: string) => {
    return formatWithTimezone(new Date(dateString), 'hh:mm a OOO', timezone);
  };

  const timezone = event.timezone || undefined;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">This Event Has Ended</h1>
        <p className="text-secondary">Thank you for hosting. We hope it was a success!</p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
        <div className="space-y-3 py-3 px-4 rounded-md border border-card-border bg-card">
          <p className="text-xs text-tertiary">EVENT RECAP</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <i className="icon-calendar size-5 text-tertiary" />
              <p>{formatEventDate(event.start, timezone)}</p>
            </div>
            <div className="flex items-center gap-3">
              <i className="icon-clock size-5 text-tertiary" />
              <p>{formatEventTime(event.start, timezone)}</p>
            </div>
            {event.address?.title && (
              <div className="flex items-center gap-3">
                <i className="icon-location-outline size-5 text-tertiary" />
                <p>{event.address.title}</p>
              </div>
            )}
            {event.virtual_url && (
              <div className="flex items-center gap-3">
                <i className="icon-video size-5 text-tertiary" />
                <p>{event.virtual_url}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 px-4 pt-3 pb-5 rounded-md border border-card-border bg-card">
          <p className="text-xs text-tertiary">FEEDBACK</p>
          <div className="flex flex-col items-center space-y-3">
            <i className="icon-cards-star size-12 text-quaternary" />
            <div className="text-center space-y-1">
              <p className="text-tertiary">No Feedback Collected</p>
              <p className="text-tertiary text-sm">You are not collecting feedback for this event.</p>
            </div>
            <p
              className="text-accent-400 text-sm cursor-pointer"
              onClick={() => modal.open(ScheduleFeedbackModal, { props: { event } })}
            >
              Schedule Feedback Email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
