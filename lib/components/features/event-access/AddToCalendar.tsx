import { ModalContent } from "$lib/components/core";
import { EventCalendarLinks, Event } from "$lib/graphql/generated/backend/graphql";

export function AddToCalendarModal({ event }: { event: Event }) {
  const addToCalendar = (calendar: keyof EventCalendarLinks) => {
    window.open(
      `${event.calendar_links?.[calendar] ?? ''}`,
      '_blank'
    )
  };

  return (
    <ModalContent icon="icon-calendar-add">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Add to Calendar</p>
          <p className="text-sm text-secondary">On registration, we sent you an email that should&apos;ve added an event to your calendar.</p>
          <p className="text-sm text-secondary">You can also click on one of the buttons to manually add the event to your calendar.</p>
        </div>
        <div className="space-y-2">
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-blue-400/16"
            onClick={() => addToCalendar('google')}
          >
            <i className="icon-google size-5 text-blue-400" />
            <p className="text-blue-400">Google Calendar</p>
          </div>
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-violet-400/16"
            onClick={() => addToCalendar('yahoo')}
          >
            <i className="icon-yahoo size-5 text-accent-400" />
            <p className="text-accent-400">Yahoo</p>
          </div>
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-amber-400/16"
            onClick={() => addToCalendar('google')}
          >
            <i className="icon-microsoft size-5 text-warning-300" />
            <p className="text-warning-300">Outlook.com</p>
          </div>
          <div
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-sm cursor-pointer bg-primary/8"
            onClick={() => addToCalendar('ical')}
          >
            <i className="icon-calendar-add size-5 text-tertiary" />
            <p className="text-tertiary">iCal (Apple / Outlook)</p>
          </div>
        </div>
      </div>
    </ModalContent>
  );
}
