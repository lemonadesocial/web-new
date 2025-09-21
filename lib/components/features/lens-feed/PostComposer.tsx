import { useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import clsx from 'clsx';

import { Avatar, Button, modal, toast, Menu, MenuItem, Divider, EmojiPicker } from '$lib/components/core';
import { MediaFile, uploadFiles } from '$lib/utils/file';
import { generatePostMetadata, getAccountAvatar } from '$lib/utils/lens/utils';
import { accountAtom } from '$lib/jotai';
import { randomUserImage } from '$lib/utils/user';
import { useLensConnect } from '$lib/hooks/useLens';
import { useMediaQuery } from '$lib/hooks/useMediaQuery';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
// import { chainsMapAtom } from "$lib/jotai";

import { ImageInput } from './ImageInput';
import { AddEventModal } from './AddEventModal';
import { EventPreview } from './EventPreview';
import { PostTextarea, PostTextareaRef } from './PostTextarea';
import { FileInput } from '../../core/file-input/file-input';
import { ProfileMenu } from '../lens-account/ProfileMenu';
import { LinkPreview } from '$lib/components/core/link';
import { extractLinks } from '$lib/utils/string';

type PostComposerProps = {
  onPost: (metadata: unknown, feedAddress?: string) => Promise<void>;
  placeholder?: string;
  showFeedOptions?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
};

export function PostComposer({
  placeholder,
  onPost,
  showFeedOptions = true,
  defaultValue = '',
  autoFocus,
}: PostComposerProps) {
  const account = useAtomValue(accountAtom);
  const isDesktop = useMediaQuery('md');
  const handleLensConnect = useLensConnect();

  const [value, setValue] = useState(defaultValue);
  const [isActive, setIsActive] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [event, setEvent] = useState<Event | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<PostTextareaRef>(null);

  const FEED_OPTIONS = [
    {
      key: 'lemonade',
      label: 'Lemonade',
      icon: 'icon-sparkles',
      address: LEMONADE_FEED_ADDRESS,
    },
    // {
    //   key: 'lemonheads',
    //   label: 'LemonHeads',
    //   icon: 'icon-passport',
    //   address: lemonHeadsAddress,
    // },
    {
      key: 'global',
      label: 'Global',
      icon: 'icon-globe',
      address: undefined,
    },
  ];

  const [selectedFeed, setSelectedFeed] = useState(FEED_OPTIONS[0]);

  const handlePost = async () => {
    const content = value.trim();
    let images: MediaFile[] = [];

    if (files.length > 0) {
      setIsUploading(true);
      images = await uploadFiles(files, 'post');
      setIsUploading(false);
    }

    try {
      setIsLoading(true);
      await onPost(generatePostMetadata({ content, images, event }), selectedFeed.address);
      setIsLoading(false);
      setValue('');
      setFiles([]);
      setEvent(undefined);
      setIsActive(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to post');
    } finally {
      setIsLoading(false);
    }
  };

  const links = extractLinks(value);

  function handleEmojiSelect(emoji: string): void {
    textareaRef.current?.insertEmoji(emoji);
  }

  return (
    <div className={clsx('border border-card-border rounded-md max-h-[calc(100dvh-300px)]', account && 'bg-card')}>
      <div className="px-4 py-3 flex gap-3">
        <div>
          <Avatar src={account ? getAccountAvatar(account) : randomUserImage()} size="xl" rounded="full" />
        </div>

        <div className="space-y-4 flex-1">
          <PostTextarea
            ref={textareaRef}
            value={value}
            setValue={setValue}
            placeholder={placeholder || `What's on your mind?`}
            onFocus={() => setIsActive(true)}
            className="mt-2"
            disabled={!account}
          />

          {links.length > 0 && <LinkPreview url={links[0]} />}

          <Divider className="h-1" />

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

          {isActive && (
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <FileInput onChange={setFiles} accept="image/*" multiple className="flex">
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

                <EmojiPicker onSelect={handleEmojiSelect} />
              </div>
              <div className="flex items-center gap-2">
                {showFeedOptions && (
                  <Menu.Root>
                    <Menu.Trigger>
                      <Button
                        variant="tertiary"
                        size="sm"
                        className="rounded-full flex items-center gap-2"
                        iconLeft={selectedFeed.icon}
                        iconRight="icon-chevron-down"
                      >
                        {selectedFeed.label}
                      </Button>
                    </Menu.Trigger>
                    <Menu.Content className="p-1 min-w-[180px]">
                      {({ toggle }) => (
                        <>
                          {FEED_OPTIONS.map((option) => (
                            <MenuItem
                              key={option.key}
                              title={option.label}
                              iconLeft={option.icon}
                              iconRight={
                                selectedFeed.key === option.key ? <i className="icon-check size-5" /> : undefined
                              }
                              onClick={() => {
                                setSelectedFeed(option);
                                toggle();
                              }}
                            />
                          ))}
                        </>
                      )}
                    </Menu.Content>
                  </Menu.Root>
                )}
                <Button
                  variant="primary"
                  className="rounded-full"
                  disabled={!value.trim() || isLoading}
                  onClick={handlePost}
                  loading={isLoading || isUploading}
                  size="sm"
                >
                  Post
                </Button>
              </div>
            </div>
          )}
        </div>

        {!!(account && !isDesktop) && (
          <ProfileMenu>
            <i className="icon-more-vert size-5 text-tertiary cursor-pointer" />
          </ProfileMenu>
        )}
      </div>

      {!account && (
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
    </div>
  );
}
