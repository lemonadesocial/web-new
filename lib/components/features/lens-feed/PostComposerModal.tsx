import React from 'react';
import { useAtomValue } from 'jotai';

import { Avatar, Button, Card, FileInput, Menu, MenuItem, modal } from '$lib/components/core';
import { accountAtom } from '$lib/jotai';
import { getAccountAvatar } from '$lib/utils/lens/utils';

import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { randomUserImage } from '$lib/utils/user';
import { extractLinks } from '$lib/utils/string';
import { LinkPreview } from '$lib/components/core/link';

import { PostTextarea } from './PostTextarea';
import { ImageInput } from './ImageInput';
import { EventPreview } from './EventPreview';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { AddEventModal } from './AddEventModal';

type FeedOptionType = {
  label: string;
  icon: string;
  address?: string;
};

type FeedOptionsType = {
  lemonade: FeedOptionType;
  global: FeedOptionType;
};

const FEED_OPTIONS: FeedOptionsType = {
  lemonade: { label: 'Lemonade', icon: 'icon-sparkles', address: LEMONADE_FEED_ADDRESS },
  global: { label: 'Global', icon: 'icon-globe', address: undefined },
};

type PostComposerModalProps = {
  defaultValue?: string;
  autoFocus?: boolean;
  placeholder?: string;
};

export function PostComposerModal({
  defaultValue = '',
  autoFocus,
  placeholder = `What's on your mind?`,
}: PostComposerModalProps) {
  const account = useAtomValue(accountAtom);

  const [value, setValue] = React.useState(defaultValue);
  const links = extractLinks(value);

  return (
    <Card.Root className="w-full h-screen md:max-h-[453px] md:w-[640px] flex flex-col">
      <Card.Header className="bg-transparent flex justify-between items-center w-full px-4 py-3 md:hidden">
        <Button
          icon="icon-chevron-left"
          className="rounded-full"
          variant="tertiary-alt"
          size="sm"
          onClick={() => modal.close()}
        />

        <div className="flex items-center gap-2">
          <FeedOptions onSelect={() => {}} />
          <Button size="sm" className="rounded-full">
            Post
          </Button>
        </div>
      </Card.Header>
      <Card.Content className="flex-1 p-0 flex flex-col">
        <div className="flex-1 py-0 md:py-4 px-4 w-full h-full flex gap-3 ">
          <div>
            <Avatar src={account ? getAccountAvatar(account) : randomUserImage()} size="xl" rounded="full" />
          </div>
          <div className="flex-1 break-all">
            <PostTextarea
              value={value}
              autoFocus={autoFocus}
              setValue={setValue}
              placeholder={placeholder}
              className="mt-2 min-h-full!"
              disabled={!account}
            />
            {links.length > 0 && <LinkPreview url={links[0]} />}
          </div>
        </div>

        <div className="p-4 border-t border-(--color-divide)">
          <Toolbar />
        </div>
      </Card.Content>
    </Card.Root>
  );
}

export function FeedOptions({
  selected = 'lemonade',
  onSelect,
}: {
  selected?: keyof FeedOptionsType;
  onSelect: (select: keyof FeedOptionsType) => void;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger>
        <Button
          variant="tertiary"
          size="sm"
          className="rounded-full flex items-center gap-2"
          iconLeft={FEED_OPTIONS[selected].icon}
          iconRight="icon-chevron-down"
        >
          {FEED_OPTIONS[selected].label}
        </Button>
      </Menu.Trigger>
      <Menu.Content className="p-1 min-w-[180px]">
        {({ toggle }) => (
          <>
            {Object.entries(FEED_OPTIONS).map(([key, item]) => (
              <MenuItem
                key={key}
                title={item.label}
                iconLeft={item.icon}
                iconRight={selected === key ? <i className="icon-check size-5" /> : undefined}
                onClick={() => {
                  onSelect(key as keyof FeedOptionsType);
                  toggle();
                }}
              />
            ))}
          </>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}

export function Toolbar() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [event, setEvent] = React.useState<Event | undefined>(undefined);

  return (
    <>
      {files.length > 0 && <ImageInput value={files} onChange={setFiles} />}

      {event && (
        <div className="relative">
          <EventPreview event={event} />
          <Button
            icon="icon-x size-[14]"
            variant="tertiary"
            className="rounded-full absolute top-3 right-3"
            size="xs"
            onClick={() => setEvent(undefined)}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <FileInput onChange={setFiles} accept="image/*" multiple>
            {(open) => <i className="icon-image size-5 text-[#60A5FA] cursor-pointer" onClick={open} />}
          </FileInput>
          <i
            className="icon-ticket size-5 text-[#A78BFA] cursor-pointer"
            onClick={() => {
              modal.open(AddEventModal, {
                props: {
                  onConfirm: setEvent,
                },
              });
            }}
          />
        </div>
      </div>
    </>
  );
}
