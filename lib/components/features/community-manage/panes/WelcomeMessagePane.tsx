'use client';
import React from 'react';
import { Button, Textarea, Card, drawer, Divider } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { Space, Event } from '$lib/graphql/generated/backend/graphql';
import { SpotlightEventsPane } from './SpotlightEventsPane';
import { SpotlightEventCard } from './SpotlightEventCard';

interface Props {
  initialValue?: string;
  initialSpotlightEvents?: Event[];
  space: Space;
  onSave: (value: string, spotlightEvents: Event[]) => void;
}

export function WelcomeMessagePane({ initialValue = '', initialSpotlightEvents = [], space, onSave }: Props) {
  const [message, setMessage] = React.useState(initialValue);
  const [spotlightEvents, setSpotlightEvents] = React.useState<Event[]>(initialSpotlightEvents);

  const handleSave = () => {
    onSave(message, spotlightEvents);
    drawer.close();
  };

  const handleRemoveEvent = (eventId: string) => {
    setSpotlightEvents((prev) => prev.filter((e) => e._id !== eventId));
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>

      <Pane.Content className="p-4 flex flex-col gap-6 overflow-auto">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Welcome Message</h2>
          <p className="text-secondary">
            This is the first message members see when they open the chat.
          </p>
        </div>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          variant="outlined"
          placeholder="Hey! I'm here to help you explore events, communities, and rewards."
        />

        <Divider />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-lg">Spotlight Events</p>
            <Button
              variant="tertiary-alt"
              size="sm"
              iconLeft="icon-plus"
              onClick={() => {
                drawer.open(SpotlightEventsPane, {
                  props: {
                    space,
                    selectedEvents: spotlightEvents,
                    onSave: (events: Event[]) => {
                      setSpotlightEvents(events);
                    },
                  },
                });
              }}
            >
              Add
            </Button>
          </div>
          {spotlightEvents.length === 0 ? (
            <div className="flex bg-card border border-card-border gap-3 items-center px-4 py-3 rounded-md">
              <i aria-hidden="true" className="icon-ticket size-8 text-tertiary" />
              <div className="flex flex-col gap-0.5 flex-1">
                <p className="text-tertiary">No spotlight events yet</p>
                <p className="text-sm text-tertiary">
                  Choose events to highlight when the chat opens.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 bg-card rounded-md border border-card-border divide-y divide-(--color-divider)">
              {spotlightEvents.map((event) => (
                <SpotlightEventCard
                  key={event._id}
                  event={event}
                  showRemove
                  onRemove={handleRemoveEvent}
                />
              ))}
            </div>
          )}
        </div>
      </Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button variant="secondary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}
