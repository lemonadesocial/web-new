import { useState } from 'react';
import { format } from 'date-fns';

import { Input, Button, Card, modal } from '$lib/components/core';
import { defaultClient } from '$lib/graphql/request/instances';
import { GetEventDocument, Event } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { extractShortId } from '$lib/utils/event';

export function AddEventModal({ onConfirm }: { onConfirm: (url: string) => void; }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setError('');
    setEvent(null);
    if (!value.trim()) return;

    let shortid: string | null = null;
    try {
      new URL(value.trim());
      shortid = extractShortId(value.trim());
    } catch {
      setError('Invalid URL');
      return;
    }

    if (!shortid) {
      setError('Invalid Lemonade event URL');
      return;
    }

    setLoading(true);
    try {
      const { data } = await defaultClient.query({
        query: GetEventDocument,
        variables: { shortid },
        fetchPolicy: 'network-only'
      });
      if (data?.getEvent) {
        setEvent({
          ...(data.getEvent as Event),
          url: value.trim(), // TODO: use url from BE
        });
        setError('');
      } else {
        setError('Event not found');
      }
    } catch {
      setError('Event not found');
    }
    setLoading(false);
  };

  return (
    <div>
      <Card.Header className="flex justify-between items-center w-[480px]">
        <p className="text-lg font-medium">Add Event</p>
        <Button
          icon="icon-x size-[14]"
          variant="tertiary"
          className="rounded-full"
          size="xs"
          onClick={() => modal.close()}
        />
      </Card.Header>
      <Card.Content className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="font-medium text-sm text-secondary">Lemonade Event URL</label>
            {loading && <i className="icon-loader text-tertiary size-4 animate-spin" />}
          </div>
          <Input
            value={url}
            onChange={handleInput}
            placeholder="https://lemonade.social/e/some-event"
            autoFocus
            error={!!error}
            disabled={loading}
          />
          {error && <p className="text-error text-sm">{error}</p>}
        </div>
        {event && (
          <Card.Root className="flex items-center gap-3 py-3 px-4 border bg-card rounded-md">
            {event.new_new_photos_expanded?.[0] && (
              <img
                src={generateUrl(event.new_new_photos_expanded[0])}
                alt={event.title}
                className="rounded-xs size-8 object-cover border-card-border"
              />
            )}
            <div>
              <div className="text-primary">{event.title}</div>
              <div className="text-tertiary text-xs">
                {event.start ? format(new Date(event.start), 'MMM d') : ''}
                {event.start ? ` at ${format(new Date(event.start), 'h:mm a')}` : ''}
              </div>
            </div>
          </Card.Root>
        )}
        <Button
          disabled={!url.trim() || !!error || !event}
          onClick={() => {
            onConfirm(url.trim());
            modal.close();
          }}
          variant="secondary"
          className="w-full"
        >
          Confirm
        </Button>
      </Card.Content>
    </div>
  );
}
