import React, { useRef } from 'react';
import { useAtomValue } from 'jotai';
import useMeasure from 'react-use-measure';

import { Avatar, Button, Card, Menu, MenuItem, modal, toast } from '$lib/components/core';
import { accountAtom } from '$lib/jotai';
import { generatePostMetadata, getAccountAvatar } from '$lib/utils/lens/utils';

import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { randomUserImage } from '$lib/utils/user';
import { extractLinks } from '$lib/utils/string';
import { LinkPreview } from '$lib/components/core/link';

import { Event, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { MediaFile, uploadFiles } from '$lib/utils/file';
import { useLensConnect, usePost } from '$lib/hooks/useLens';
import { defaultClient } from '$lib/graphql/request/instances';

import { PostTextarea, PostTextareaRef } from './PostTextarea';
import { ImageInput } from './ImageInput';
import { EventPreview } from './EventPreview';
import clsx from 'clsx';
import { isMobile, isMobileOnly } from 'react-device-detect';
import { AnimatePresence, motion } from 'framer-motion';
import { PostToolbar } from './PostToolbar';

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
  post?: any;
};

export function PostComposerModal({
  defaultValue = '',
  placeholder = `What's on your mind?`,
  post,
}: PostComposerModalProps) {
  const account = useAtomValue(accountAtom);
  const handleLensConnect = useLensConnect();
  const { createPost, updatePost } = usePost();

  const [ref, { height }] = useMeasure();

  const textareaRef = useRef<PostTextareaRef>(null);

  const [value, setValue] = React.useState(() => {
    if (post && 'content' in post.metadata) {
      return post.metadata.content || '';
    }
    return defaultValue;
  });
  const [selectedFeed, setSelectedFeed] = React.useState<keyof FeedOptionsType>('lemonade');
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);
  const [event, setEvent] = React.useState<Event | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFocus, setIsFocus] = React.useState(false);
  const [gif, setGif] = React.useState<string | undefined>(undefined);
  const [isBoldActive, setIsBoldActive] = React.useState(false);
  const [isItalicActive, setIsItalicActive] = React.useState(false);

  const isEditing = !!post;
  const links = extractLinks(value);

  React.useEffect(() => {
    const loadExistingImages = async () => {
      if (post && 'attachments' in post.metadata && post.metadata.attachments) {
        const imageAttachments = post.metadata.attachments.filter(
          (attachment) => attachment.__typename === 'MediaImage'
        );

        if (imageAttachments.length > 0) {
          setIsLoadingImages(true);
          try {
            const filePromises = imageAttachments.map(async (attachment) => {
              const imageAttachment = attachment as { item: string };
              const response = await fetch(imageAttachment.item);

              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status}`);
              }

              const blob = await response.blob();
              const contentType = response.headers.get('content-type') || 'image/*';

              return new File([blob], `image-${Date.now()}.${contentType.split('/')[1] || 'jpg'}`, {
                type: contentType,
                lastModified: Date.now(),
              });
            });

            const loadedFiles = await Promise.all(filePromises);
            setFiles(loadedFiles);
          } catch (error) {
            toast.error('Failed to load existing images');
          } finally {
            setIsLoadingImages(false);
          }
        }
      }
    };

    loadExistingImages();
  }, [post]);

  React.useEffect(() => {
    const loadExistingEvent = async () => {
      if (post && post.metadata.__typename === 'EventMetadata') {
        const eventMetadata = post.metadata as { location?: string };

        const shortid = eventMetadata.location;

        if (shortid) {
          try {
            const { data } = await defaultClient.query({
              query: GetEventDocument,
              variables: { shortid },
              fetchPolicy: 'network-only',
            });
            if (data?.getEvent) {
              setEvent(data.getEvent as Event);
            }
          } catch (error) {
            toast.error('Failed to load existing event');
          }
        }
      }
    };

    loadExistingEvent();
  }, [post]);

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

      if (isEditing && post) {
        await updatePost(post.id, generatePostMetadata({ content, images, event, gif }));
      } else {
        await createPost({
          metadata: generatePostMetadata({ content, images, event, gif }),
          feedAddress: FEED_OPTIONS[selectedFeed].address,
        });
      }

      setValue('');
      setFiles([]);
      setEvent(undefined);
      setGif(undefined);
      modal.close();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'post'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ height: '100%' }}
        animate={{ height: isMobileOnly && isFocus ? `calc(100dvh - ${height - 140}px)` : '100%' }}
      >
        <Card.Root className="w-full h-full md:h-auto md:w-[640px] flex flex-col overflow-visible">
          <Card.Header className="bg-transparent flex justify-between items-center w-full px-4 py-3 md:hidden">
            <Button
              icon="icon-chevron-left"
              className="rounded-full"
              variant="tertiary-alt"
              size="sm"
              onClick={() => modal.close()}
            />

            <div className="flex items-center gap-2">
              {!isEditing && <FeedOptions selected={selectedFeed} onSelect={(opt) => setSelectedFeed(opt)} />}
              <Button size="sm" className="rounded-full" loading={isUploading || isSubmitting || isLoadingImages} onClick={handlePost}>
                {isEditing ? 'Update' : 'Post'}
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
                  ref={textareaRef}
                  value={value}
                  onBlur={() => setIsFocus(false)}
                  onFocus={() => setIsFocus(true)}
                  onSelectionChange={updateFormatStates}
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
                {
                  !!(gif || files.length > 0) && (
                    <div className="flex gap-2">
                      {
                        gif && (
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
                        )
                      }

                      {files.length > 0 && <ImageInput value={files} onChange={setFiles} />}
                    </div>
                  )
                }


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

                <div className="flex justify-between">
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

                  <div className="items-center gap-2 hidden md:flex">
                    {!isEditing && <FeedOptions selected={selectedFeed} onSelect={(opt) => setSelectedFeed(opt)} />}
                    <Button
                      size="sm"
                      className="rounded-full"
                      disabled={!value.trim()}
                      loading={isUploading || isSubmitting || isLoadingImages}
                      onClick={handlePost}
                      variant={isEditing ? 'secondary' : 'primary'}
                    >
                      {isEditing ? 'Update' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 gap-3 flex items-center bg-card rounded-b-md">
                <div className="flex items-center justify-center bg-error/16 size-9 rounded-full">
                  <i aria-hidden="true" className="icon-lock size-5 text-error" />
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
                iconRight={selected === key ? <i aria-hidden="true" className="icon-check size-5" /> : undefined}
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
