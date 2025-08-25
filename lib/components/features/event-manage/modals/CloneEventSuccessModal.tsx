import { Button, Card } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { formatWithTimezone } from '$lib/utils/date';
import { getEventAddress } from '$lib/utils/event';
import { randomEventDP } from '$lib/utils/user';

export function CloneEventSuccessModal({ events }: { events: Event[] }) {
  const handleOpen = (shortid: string) => window.open(`/e/manage/${shortid}`, '_blank');

  const getEventLocation = (event: Event) => {
    if (event.address) {
      return getEventAddress(event.address);
    }

    if (event.virtual_url) return 'Virtual';

    return '';
  };

  return (
    <Card.Root className="w-[340px]">
      <Card.Header className="flex justify-between items-start bg-transparent">
        <div className="p-3 w-[56px] aspect-square rounded-full bg-success-400/16 flex items-center justify-center">
          <i className="icon-richtext-check text-success-400 size-8" />
        </div>
        <Button icon="icon-x" size="xs" variant="tertiary-alt" className="rounded-full" />
      </Card.Header>
      <Card.Content className="flex flex-col gap-4 max-w-[448px]">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-tertiary">You’ve Cloned</p>
          <p className="text-lg">{events[0].title}</p>
          <p className="text-sm text-secondary">
            {events.length === 1
              ? 'We’ve copied everything over to your new event. Open it below to make further changes.'
              : `We’ve created ${events.length} new events. You can open each of them below.`}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 max-h-[300px] overflow-auto no-scrollbar">
          {events.map((event, idx) => {
            if (idx === 0) {
              return (
                <Card.Root key={event._id} className="overflow-visible">
                  <Card.Content className="flex gap-3 px-3 py-2 items-center">
                    {!!event.new_new_photos?.length ? (
                      <div
                        style={{
                          background: `url(${generateUrl(event.new_new_photos[0], { resize: { width: 36, height: 36, fit: 'cover' } })})`,
                        }}
                        className="rounded-xs border"
                      />
                    ) : (
                      <img src={randomEventDP()} className="w-9 aspect-square rounded-xs border" />
                    )}

                    <div className="flex-1">
                      <p className="line-clamp-1">{event.title}</p>
                      <p className="text-xs text-tertiary">
                        {events.length === 1
                          ? formatWithTimezone(event.start, 'EEE, MMM dd, hh:mm a OOOO', event.timezone)
                          : getEventLocation(event)}
                      </p>
                    </div>

                    <div
                      className="size-5 hover:text-primary flex items-center justify-center"
                      onClick={() => handleOpen(event.shortid)}
                    >
                      <i className="text-quaternary icon-arrow-outward size-5" />
                    </div>
                  </Card.Content>
                </Card.Root>
              );
            }
            return (
              <Card.Root key={event._id} className="overflow-visible" onClick={() => handleOpen(event.shortid)}>
                <Card.Content className="px-3 py-2 flex gap-3">
                  <div className="flex gap-2 flex-1">
                    <p>{formatWithTimezone(event.start, 'MMM dd, yyyy', event.timezone)}</p>
                    <p className="text-tertiary">{formatWithTimezone(event.start, 'EEEE', event.timezone)}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <p className="text-tertiary">{formatWithTimezone(event.start, 'hh:mm a', event.timezone)}</p>
                    <i className="text-quaternary icon-arrow-outward size-5" />
                  </div>
                </Card.Content>
              </Card.Root>
            );
          })}
        </div>
      </Card.Content>
    </Card.Root>
  );
}
