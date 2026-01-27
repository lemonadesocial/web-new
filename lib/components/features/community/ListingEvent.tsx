import { Badge, Button, Card, Menu, modal } from '$lib/components/core';
import {
  Event,
  GetEventDocument,
  GetSpaceTagsDocument,
  PinEventsToSpaceDocument,
  SpaceTag,
  SpaceTagType,
} from '$lib/graphql/generated/backend/graphql';
import { useClient, useQuery } from '$lib/graphql/request';
import { format } from 'date-fns';
import { uniq } from 'lodash';
import React from 'react';

export function ListingEvent({ spaceId }: { spaceId: string }) {
  const [tags, setTags] = React.useState<SpaceTag[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [linkEvent, setLinkEvent] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const { client } = useClient();

  const handleAddEvent = async () => {
    const shortid = linkEvent ? linkEvent.substring(linkEvent.lastIndexOf('/') + 1) : '';
    if (events.find((e) => e.shortid === shortid)) return;
    setAdding(true);
    const { data } = await client.query({
      query: GetEventDocument,
      variables: { shortid },
      fetchPolicy: 'network-only',
    });

    if (data?.getEvent) {
      setEvents((prev) => [...prev, data.getEvent as Event]);
    }

    setAdding(false);
    setLinkEvent('');
  };

  const handlePinEvents = async () => {
    setSubmitting(true);
    const promises: Promise<unknown>[] = [];
    events.map((e) => {
      const variables = { events: [e._id], tags: tags.map((item) => item._id), space: spaceId };
      promises.push(client.query({ query: PinEventsToSpaceDocument, variables, fetchPolicy: 'network-only' }));
    });

    await Promise.all(promises);
    setSubmitting(false);
    modal.close();
  };

  const existing = events.find((e) => e.shortid === linkEvent?.substring(linkEvent.lastIndexOf('/') + 1));

  return (
    <div className="w-[350] md:w-[480]">
      <Card.Header className="flex justify-between items-center">
        <p className="text-lg font-medium">Submit Lemonade Event</p>
        <Button
          icon="icon-x size-[14]"
          variant="tertiary"
          className="rounded-full"
          size="xs"
          onClick={() => modal.close()}
        />
      </Card.Header>
      <Card.Content>
        <div className="p-1 flex flex-col gap-3 items-start">
          {events.map((e) => (
            <Card.Root key={e._id} className="w-full">
              <Card.Content className="flex justify-between items-center w-full">
                <div>
                  <p className="text-md">{e.title}</p>
                  <span className="text-tertiary">
                    {format(e.start, 'MMM dd')} at {format(e.start, 'h:mm a')}
                  </span>
                </div>
                <Button
                  icon="icon-minus"
                  size="sm"
                  variant="tertiary"
                  onClick={() => setEvents((prev) => prev.filter((p) => e._id !== p._id))}
                />
              </Card.Content>
            </Card.Root>
          ))}
          <div className="w-full">
            <div className="bg-background/64 border flex py-1 px-1.5 gap-3.5 rounded-sm items-center h-[44px] focus-within:border-primary">
              <input
                className="flex-1 outline-none px-1.5"
                value={linkEvent}
                onChange={(e) => setLinkEvent(e.target.value)}
              />
              {linkEvent && !existing && (
                <Button loading={adding} size="sm" variant="tertiary" iconLeft="icon-plus" onClick={handleAddEvent}>
                  Add
                </Button>
              )}
            </div>
            {existing && <p className="text-danger-500 text-sm mt-1">* This event was added</p>}
          </div>
          <AddTags type={SpaceTagType.Event} spaceId={spaceId} onChange={(value) => setTags(value)} />

          <Button
            loading={submitting}
            disabled={!events.length}
            variant="secondary"
            className="w-full"
            onClick={() => handlePinEvents()}
          >
            Submit Event
          </Button>
        </div>
      </Card.Content>
    </div>
  );
}

export function AddTags({
  spaceId,
  value = [],
  type,
  onChange,
  onAdd,
  onRemove,
}: {
  spaceId: string;
  value?: SpaceTag[];
  type: SpaceTagType;
  onChange?: (tags: SpaceTag[]) => void;
  onRemove?: (tag: SpaceTag) => void;
  onAdd?: (tag: SpaceTag) => void;
}) {
  const [tag, setTag] = React.useState('');
  const [tags, setTags] = React.useState<SpaceTag[]>(value);
  const { data } = useQuery(GetSpaceTagsDocument, { variables: { space: spaceId } });
  const list = (data?.listSpaceTags.filter(
    (t) => (t as SpaceTag).type === type && !tags.map((i) => i._id).includes((t as SpaceTag)._id),
  ) || []) as SpaceTag[];

  const onSelectTag = (t: SpaceTag) => {
    const _tags = uniq([...tags, t]);
    setTags(_tags);
    onChange?.(_tags);
  };

  return (
    <Menu.Root strategy="fixed" placement="bottom-start">
      <div className="flex gap-1 items-center flex-wrap">
        {tags.map((t) => (
          <Badge
            key={t._id}
            title={t.tag}
            color={t.color}
            onClose={() => {
              const arr = tags.filter((i) => i._id !== t._id);
              setTags(arr);
              onChange?.(arr);
              onRemove?.(t);
            }}
          />
        ))}
        <Menu.Trigger>
          <Button iconLeft="icon-plus" variant="tertiary" size="xs">
            Add Tag
          </Button>
        </Menu.Trigger>
      </div>
      <Menu.Content className="w-[252px] max-h-[300px] overflow-auto p-0">
        <input
          className="outline-none bg-card text-md px-2.5 py-2 w-full"
          placeholder="Search Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        {list
          .filter((t) => (tag ? t.tag.includes(tag) : true))
          .map((t: SpaceTag) => (
            <div
              key={t._id}
              onClick={() => {
                onSelectTag(t);
                onAdd?.(t);
              }}
              className="flex px-2 py-1.5 gap-2.5 items-center hover:bg-primary/8 rounded-xs cursor-pointer"
            >
              <i className="icon-dot" style={{ color: t.color }} />
              <p className="text-sm font-medium">{t.tag}</p>
            </div>
          ))}
      </Menu.Content>
    </Menu.Root>
  );
}
