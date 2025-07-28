import React from 'react';
import { useAtomValue } from 'jotai';

import { Avatar, Button, Card, Menu, MenuItem, modal } from '$lib/components/core';
import { accountAtom } from '$lib/jotai';
import { getAccountAvatar } from '$lib/utils/lens/utils';

import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { randomUserImage } from '$lib/utils/user';

import { PostTextarea } from './PostTextarea';
import { extractLinks } from '$lib/utils/string';
import { LinkPreview } from '$lib/components/core/link';

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
      <Card.Content className="flex-1 py-0 md:py-4 px-4 w-full h-full flex gap-3">
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
        <div></div>
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
  return;
}
