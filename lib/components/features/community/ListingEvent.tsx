import { Badge, Button, Card, Menu, modal } from '$lib/components/core';
import {
  Event,
  GetEventDocument,
  GetSpaceTagsDocument,
  PinEventsToSpaceDocument,
  SpaceTagBase,
  SpaceTagType,
} from '$lib/generated/backend/graphql';
import { useClient, useQuery } from '$lib/request';
import { uniq } from 'lodash';
import React from 'react';

export function ListingEvent({ spaceId }: { spaceId: string }) {
  const [tags, setTags] = React.useState<SpaceTagBase[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [linkEvent, setLinkEvent] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const [submiting, setSubmitting] = React.useState(false);

  const { client } = useClient();

  const handleAddEvent = async () => {
    const shortid = linkEvent ? linkEvent.substring(linkEvent.lastIndexOf('/') + 1) : '';
    setAdding(true);
    const { data } = await client.query({
      query: GetEventDocument,
      variables: { shortid },
      fetchPolicy: 'network-only',
    });

    if (data.getEvent) {
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

  return (
    <Card className="p-0 rounded-lg bg-alabaster-950 w-[480]">
      <div className="flex justify-between items-center bg-tertiary/4 px-5 py-3 rounded-tl-lg rounded-tr-lg">
        <p className="text-lg font-medium">Submit Lemonade Event</p>
        <Button
          icon="icon-x size-[14]"
          variant="tertiary"
          className="rounded-full"
          size="xs"
          onClick={() => modal.close()}
        />
      </div>
      <div className="p-5 flex flex-col gap-3 items-start">
        <div className="w-full">
          <div className="focus-within:border-tertiary bg-woodsmoke-950/64 border flex py-1 px-1.5 gap-3.5 rounded-sm items-center">
            <input
              className="flex-1 outline-none px-1.5"
              value={linkEvent}
              onChange={(e) => setLinkEvent(e.target.value)}
            />
            <Button loading={adding} size="sm" variant="tertiary" iconLeft="icon-plus" onClick={handleAddEvent}>
              Add
            </Button>
          </div>
        </div>
        <AddTags type={SpaceTagType.Event} spaceId={spaceId} onChange={(value) => setTags(value)} />

        <Button loading={submiting} variant="secondary" className="w-full rounded-sm" onClick={() => handlePinEvents()}>
          Submit Event
        </Button>
      </div>
    </Card>
  );
}

export function AddTags({
  spaceId,
  type,
  onChange,
}: {
  spaceId: string;
  type: SpaceTagType;
  onChange?: (tags: SpaceTagBase[]) => void;
}) {
  const [tag, setTag] = React.useState('');
  const [tags, setTags] = React.useState<SpaceTagBase[]>([]);
  const { data } = useQuery(GetSpaceTagsDocument, { variables: { space: spaceId } });
  const list = (data?.listSpaceTags.filter((t) => (t as SpaceTagBase).type === type) || []) as SpaceTagBase[];

  const onSelectTag = (t: SpaceTagBase) => {
    const _tags = uniq([...tags, t]);
    setTags(_tags);
    onChange?.(_tags);
  };
  return (
    <>
      <Menu.Root placement="bottom-start">
        <div className="flex gap-1 items-center flex-wrap">
          {tags.map((t) => (
            <Badge
              key={t._id}
              title={t.tag}
              color={t.color}
              onClose={() => {
                setTags((prev) => prev.filter((i) => i._id !== t._id));
              }}
            />
          ))}
          <Menu.Trigger>
            <Button iconLeft="icon-plus" variant="tertiary" size="xs" className="rounded-full">
              Add Tag
            </Button>
          </Menu.Trigger>
        </div>
        <Menu.Content className="w-[252px] max-h-[300px] overflow-auto p-0">
          <input
            className="outline-none bg-tertiary/4 text-md px-2.5 py-2 w-full"
            placeholder="Search Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          {list
            .filter((t) => (tag ? t.tag.includes(tag) : true))
            .map((t: SpaceTagBase) => (
              <div
                key={t._id}
                onClick={() => onSelectTag(t)}
                className="flex px-2 py-1.5 gap-2.5 items-center hover:bg-tertiary/8 rounded-xs cursor-pointer"
              >
                <i className="icon-dot" style={{ color: t.color }} />
                <p className="text-sm font-medium">{t.tag}</p>
              </div>
            ))}
        </Menu.Content>
      </Menu.Root>
    </>
  );
}
