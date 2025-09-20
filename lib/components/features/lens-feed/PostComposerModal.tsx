import React from 'react';
import { useAtomValue } from 'jotai';
import useMeasure from 'react-use-measure';

import { Avatar, Button, Card, FileInput, Menu, MenuItem, modal, toast } from '$lib/components/core';
import { accountAtom } from '$lib/jotai';
import { generatePostMetadata, getAccountAvatar } from '$lib/utils/lens/utils';

import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { randomUserImage } from '$lib/utils/user';
import { extractLinks } from '$lib/utils/string';
import { LinkPreview } from '$lib/components/core/link';

import { Event } from '$lib/graphql/generated/backend/graphql';
import { MediaFile, uploadFiles } from '$lib/utils/file';
import { useLensConnect, usePost } from '$lib/hooks/useLens';

import { PostTextarea } from './PostTextarea';
import { ImageInput } from './ImageInput';
import { EventPreview } from './EventPreview';
import { AddEventModal } from './AddEventModal';
import clsx from 'clsx';
import { isMobile, isMobileOnly } from 'react-device-detect';
import { AnimatePresence, motion } from 'framer-motion';

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
  placeholder = `What's on your mind?`,
}: PostComposerModalProps) {
  const account = useAtomValue(accountAtom);
  const handleLensConnect = useLensConnect();
  const { createPost } = usePost();

  const [ref, { height }] = useMeasure();

  const [value, setValue] = React.useState(defaultValue);
  const [selectedFeed, setSelectedFeed] = React.useState<keyof FeedOptionsType>('lemonade');
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [event, setEvent] = React.useState<Event | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFocus, setIsFocus] = React.useState(false);

  const links = extractLinks(value);

  const handlePost = async () => {
    const content = value.trim();
    let images: MediaFile[] = [];

    if (files.length > 0) {
      setIsUploading(true);
      images = await uploadFiles(files, 'post');
      setIsUploading(false);
    }

    try {
      setIsSubmitting(true);
      await createPost({
        metadata: generatePostMetadata({ content, images, event }),
        feedAddress: FEED_OPTIONS[selectedFeed].address,
      });
      setValue('');
      setFiles([]);
      setEvent(undefined);
      modal.close();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ height: '100%' }}
        animate={{ height: isMobileOnly && isFocus ? `calc(100dvh - ${height - 140}px)` : '100%' }}
      >
        <Card.Root className="w-full h-full md:h-auto md:w-[640px] flex flex-col">
          <Card.Header className="bg-transparent flex justify-between items-center w-full px-4 py-3 md:hidden">
            <Button
              icon="icon-chevron-left"
              className="rounded-full"
              variant="tertiary-alt"
              size="sm"
              onClick={() => modal.close()}
            />

            <div className="flex items-center gap-2">
              <FeedOptions selected={selectedFeed} onSelect={(opt) => setSelectedFeed(opt)} />
              <Button size="sm" className="rounded-full" loading={isUploading || isSubmitting} onClick={handlePost}>
                Post
              </Button>
            </div>
          </Card.Header>
          <Card.Content className="flex-1 p-0 h-auto flex flex-col">
            <div className="flex-1 py-0 md:py-4 px-4 w-full h-full flex gap-3 ">
              <div>
                <Avatar src={account ? getAccountAvatar(account) : randomUserImage()} size="xl" rounded="full" />
              </div>
              <div className="flex-1 break-all flex flex-col gap-5 overflow-auto no-scrollbar">
                <PostTextarea
                  value={value}
                  onBlur={() => setIsFocus(false)}
                  onFocus={() => setIsFocus(true)}
                  setValue={setValue}
                  placeholder={placeholder}
                  className={clsx('mt-2', isMobile && 'max-h-2/3!')}
                  disabled={!account}
                />
                {links.length > 0 && <LinkPreview url={links[0]} />}
              </div>
            </div>
            {account ? (
              <div className="p-4 border-t border-(--color-divider) space-y-4">
                {files.length > 0 && <ImageInput value={files} onChange={setFiles} />}

                <div className="flex justify-between ">
                  <Toolbar event={event} onAddEvent={(event) => setEvent(event)} onSelectFile={setFiles} />

                  <div className="items-center gap-2 hidden md:flex">
                    <FeedOptions selected={selectedFeed} onSelect={(opt) => setSelectedFeed(opt)} />
                    <Button
                      size="sm"
                      className="rounded-full"
                      disabled={!value.trim()}
                      loading={isUploading || isSubmitting}
                      onClick={handlePost}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 gap-3 flex items-center bg-card rounded-b-md">
                <div className="flex items-center justify-center bg-error/16 size-9 rounded-full">
                  <i className="icon-lock size-5 text-error" />
                </div>
                <div className="flex-1">
                  <p>Posting is Locked</p>
                  <p className="text-tertiary text-sm">Connect wallet to start posting on Lemonade.</p>
                </div>
                <Button variant="secondary" className="rounded-full" onClick={handleLensConnect} size="sm">
                  Connect Wallet
                </Button>
              </div>
            )}
          </Card.Content>
        </Card.Root>
      </motion.div>
    </AnimatePresence>
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

export function Toolbar({
  event,
  onSelectFile,
  onAddEvent,
}: {
  event?: Event;
  onAddEvent: (event?: Event) => void;
  onSelectFile: (file: File[]) => void;
}) {
  return (
    <>
      {event && (
        <div className="relative">
          <EventPreview event={event} />
          <Button
            icon="icon-x size-[14]"
            variant="tertiary"
            className="rounded-full absolute top-3 right-3"
            size="xs"
            onClick={() => {
              onAddEvent(undefined);
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <FileInput onChange={onSelectFile} accept="image/*" multiple>
            {(open) => <i className="icon-image size-5 text-[#60A5FA] cursor-pointer" onClick={open} />}
          </FileInput>
          <i
            className="icon-ticket size-5 text-[#A78BFA] cursor-pointer"
            onClick={() => {
              modal.open(AddEventModal, {
                props: {
                  onConfirm: onAddEvent,
                },
              });
            }}
          />
        </div>
      </div>
    </>
  );
}
