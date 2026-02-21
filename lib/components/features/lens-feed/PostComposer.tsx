import { useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import clsx from 'clsx';

import { Avatar, Button, toast, Menu, MenuItem, Divider } from '$lib/components/core';
import { MediaFile, uploadFiles } from '$lib/utils/file';
import { generatePostMetadata, getAccountAvatar } from '$lib/utils/lens/utils';
import { accountAtom } from '$lib/jotai';
import { randomUserImage } from '$lib/utils/user';
import { useLensConnect } from '$lib/hooks/useLens';
import { useMediaQuery } from '$lib/hooks/useMediaQuery';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { htmlToMarkdown, markdownToHtml } from '$lib/utils/markdown';
// import { chainsMapAtom } from "$lib/jotai";

import { ImageInput } from './ImageInput';
import { EventPreview } from './EventPreview';
import { PostTextarea, PostTextareaRef } from './PostTextarea';
import { ProfileMenu } from '../lens-account/ProfileMenu';
import { LinkPreview } from '$lib/components/core/link';
import { extractLinks } from '$lib/utils/string';
import { PostToolbar } from './PostToolbar';

type PostComposerProps = {
  onPost: (metadata: unknown, feedAddress?: string) => Promise<void>;
  placeholder?: string;
  showFeedOptions?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  renderLock?: React.ReactElement;
};

export function PostComposer({
  placeholder,
  onPost,
  showFeedOptions = true,
  defaultValue = '',
  renderLock,
}: PostComposerProps) {
  const account = useAtomValue(accountAtom);
  const isDesktop = useMediaQuery('md');
  const handleLensConnect = useLensConnect();

  const [value, setValue] = useState(markdownToHtml(defaultValue));
  const [isActive, setIsActive] = useState(false);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [gif, setGif] = useState<string | undefined>(undefined);
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
    const content = htmlToMarkdown(value).trim();
    let images: MediaFile[] = [];

    if (files.length > 0) {
      setIsUploading(true);
      images = await uploadFiles(files, 'post');
      setIsUploading(false);
    }

    try {
      setIsLoading(true);
      await onPost(generatePostMetadata({ content, images, event, gif }), selectedFeed.address);
      setIsLoading(false);
      setValue('');
      setFiles([]);
      setEvent(undefined);
      setGif(undefined);
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

  function handleGifSelect(gifUrl: string): void {
    setGif(gifUrl);
  }

  function updateFormatStates(): void {
    setIsBoldActive(textareaRef.current?.isBoldActive() ?? false);
    setIsItalicActive(textareaRef.current?.isItalicActive() ?? false);
  }

  function handleBoldSelect(): void {
    textareaRef.current?.toggleBold();
    setTimeout(updateFormatStates, 0);
  }

  function handleItalicSelect(): void {
    textareaRef.current?.toggleItalic();
    setTimeout(updateFormatStates, 0);
  }

  return (
    <div
      className={clsx(
        'border-(length:--card-border-width) border-card-border rounded-md max-h-[calc(100dvh-300px)]',
        account && 'bg-card',
      )}
    >
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
            onSelectionChange={updateFormatStates}
            className="mt-2"
            disabled={!account || !!renderLock}
          />

          {links.length > 0 && <LinkPreview url={links[0]} />}

          <Divider className="h-1" />

          {!!(gif || files.length > 0) && (
            <div className="flex gap-2">
              {gif && (
                <div className="relative group w-35 h-35 ">
                  <img src={gif} className="w-full h-full object-cover rounded-sm border border-card-border" />
                  <button
                    type="button"
                    className="absolute top-3 right-3 bg-overlay-secondary rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => setGif(undefined)}
                  >
                    <i aria-hidden="true" className="icon-x text-tertiary size-[14px]" />
                  </button>
                </div>
              )}

              {files.length > 0 && <ImageInput value={files} onChange={setFiles} />}
            </div>
          )}

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
              <PostToolbar
                onAddEvent={(event) => setEvent(event)}
                onSelectFiles={setFiles}
                onSelectEmoji={handleEmojiSelect}
                onSelectGif={handleGifSelect}
                onSelectBold={handleBoldSelect}
                onSelectItalic={handleItalicSelect}
                isBoldActive={isBoldActive}
                isItalicActive={isItalicActive}
              />
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
                                selectedFeed.key === option.key ? <i aria-hidden="true" className="icon-check size-5" /> : undefined
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
            <i aria-hidden="true" className="icon-more-vert size-5 text-tertiary cursor-pointer" />
          </ProfileMenu>
        )}
      </div>

      {renderLock ||
        (!account && (
          <PostLocked title="Posting is Locked" subtitle="Connect wallet to start posting on Lemonade.">
            <Button variant="secondary" className="rounded-full" onClick={handleLensConnect} size="sm">
              Connect Wallet
            </Button>
          </PostLocked>
        ))}
    </div>
  );
}

export function PostLocked({
  title,
  subtitle,
  children,
}: React.PropsWithChildren & { title: string; subtitle: string }) {
  return (
    <div className="px-4 py-3 gap-3 flex flex-col md:flex-row md:items-center bg-card rounded-b-md">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center justify-center bg-error/16 size-9 rounded-full">
          <i aria-hidden="true" className="icon-lock size-5 text-error" />
        </div>
        <div className="flex-1">
          <p>{title}</p>
          <p className="text-tertiary text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
