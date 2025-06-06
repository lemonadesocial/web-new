import { ImageMetadata, Post, Repost, TextOnlyMetadata } from '@lens-protocol/client';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Avatar, Spacer, toast } from '$lib/components/core';
import { getAccountAvatar } from '$lib/utils/lens/utils';

import { FeedPostGallery } from './FeedPostGallery';
import { PostReaction } from './PostReaction';
import { PostRepost } from './PostRepost';
import { PostButton } from './PostButton';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostComment } from './PostComment';

type FeedPostProps = {
  post: Post | Repost;
  isComment?: boolean;
  onSelect?: (e: React.MouseEvent<HTMLElement>) => void;
  showRepost?: boolean;
};

export function FeedPost({ post, isComment, onSelect, showRepost }: FeedPostProps) {
  const { author, timestamp } = post;

  const isRepost = post.__typename === 'Repost';
  const rootPost = isRepost ? post.repostOf : post;
  const metadata = rootPost.metadata;

  // NOTE: it filter on timeline list post - double-check
  // if ((post as Post).commentOn && !isComment) return null;

  if (isRepost && !showRepost) return null;

  if (isComment) {
    return (
      <div className={clsx('py-3 px-4 gap-3 flex', onSelect && 'cursor-pointer')} onClick={onSelect}>
        <Avatar src={getAccountAvatar(author)} size="xl" rounded="full" />
        <div className="flex-1 h-full">
          <div className="flex gap-1.5">
            <p>{author.username?.localName}</p>
            <p className="text-tertiary">{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</p>
          </div>
          <PostContent post={rootPost} />
          {/* <p className="text-secondary whitespace-pre-line">{(metadata as TextOnlyMetadata).content}</p> */}
          {(metadata as ImageMetadata).attachments?.length > 0 && (
            <>
              <Spacer className="h-2" />
              <FeedPostGallery
                attachments={(metadata as ImageMetadata).attachments.map(({ item }) => item)}
                className="mt-2"
              />
              <Spacer className="h-2" />
            </>
          )}
          <div className="mt-2 flex gap-2">
            <PostReaction post={rootPost} isComment />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={twMerge(
          'bg-card rounded-md border border-card-border px-4 py-3 space-y-3',
          clsx(onSelect && 'cursor-pointer hover:boder-card-boder-hover'),
        )}
        onClick={onSelect}
      >
        {isRepost && (
          <div className="flex items-center gap-2">
            <i className="icon-repost size-4 text-tertiary" />
            <p className="text-tertiary text-sm">{author.username?.localName} reposted</p>
          </div>
        )}

        <div className="flex justify-between">
          <PostHeader post={rootPost} />
          <div className="flex gap-2">
            <PostButton
              icon="icon-upload"
              onClick={(e) => {
                e.stopPropagation();
                toast.success('Coming soon');
              }}
            />
            <PostButton
              icon="icon-more-vert"
              onClick={(e) => {
                e.stopPropagation();
                toast.success('Coming soon');
              }}
            />
          </div>
        </div>

        <PostContent post={rootPost} />

        <div className="flex justify-between">
          <div className="flex gap-4 sm:gap-2">
            <PostReaction post={rootPost} />
            <PostComment post={rootPost} />
            <PostRepost post={rootPost} />
          </div>
          <PostButton
            icon="icon-share"
            onClick={(e) => {
              e.stopPropagation();
              toast.success('Coming soon');
            }}
          />
        </div>
      </div>
    </div>
  );
}
