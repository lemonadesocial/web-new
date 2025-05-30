import { ImageMetadata, LinkMetadata, Post, Repost, TextOnlyMetadata } from "@lens-protocol/client";
import { formatDistanceToNow } from "date-fns";

import { Avatar, Button, toast } from "$lib/components/core";
import { getAccountAvatar } from "$lib/utils/lens/utils";

import { FeedPostGallery } from './FeedPostGallery';
import { PostReaction } from "./PostReaction";
import { PostRepost } from "./PostRepost";
import { EventPreview } from "./EventPreview";

type FeedPostProps = {
  post: Post | Repost;
  isComment?: boolean;
};

export function FeedPost({ post, isComment }: FeedPostProps) {
  const { author, timestamp } = post;
  const rootPost = post.__typename === 'Repost' ? post.repostOf : post;
  const metadata = rootPost.metadata;

  if ((post as Post).commentOn && !isComment) return null;

  if (isComment) return (
    <div className="py-3 px-4 gap-3 flex">
      <Avatar
        src={getAccountAvatar(author)}
        size="xl"
        rounded="full"
      />
      <div>
        <div className="flex gap-1.5">
          <p>
            {author.username?.localName}
          </p>
          <p className="text-tertiary">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </p>
        </div>
        <p className="text-secondary whitespace-pre-line">{(metadata as TextOnlyMetadata).content}</p>
        {(metadata as ImageMetadata).attachments?.length > 0 && (
          <FeedPostGallery attachments={(metadata as ImageMetadata).attachments.map(({ item }) => item)} className="mt-2" />
        )}
        <div className="mt-2 flex gap-2">
          <PostReaction post={rootPost} isComment />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="bg-card rounded-md border border-card-border px-4 py-3 space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Avatar
              src={getAccountAvatar(author)}
              size="xl"
              rounded="full"
            />
            <div className="flex-1">
              <p>
                {author.username?.localName}
              </p>
              <p className="text-sm text-tertiary">
                {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="tertiary"
              onClick={() => toast.success('Coming soon')}
              iconLeft="icon-upload"
              className="rounded-full"
            />
            <Button
              variant="tertiary"
              onClick={() => toast.success('Coming soon')}
              iconLeft="icon-more-vert"
              className="rounded-full"
            />
          </div>
        </div>
        <p className="text-secondary whitespace-pre-line">{(metadata as TextOnlyMetadata).content}</p>
        {(metadata as ImageMetadata).attachments?.length > 0 && (
          <FeedPostGallery attachments={(metadata as ImageMetadata).attachments.map(({ item }) => item)} />
        )}
        {
          (metadata as LinkMetadata).sharingLink && (
            <EventPreview url={(metadata as LinkMetadata).sharingLink} />
          )
        }
        <div className="flex justify-between">
          <div className="flex gap-2">
            <PostReaction post={rootPost} />
            <Button
              variant="tertiary"
              iconLeft="icon-chat"
              className="rounded-full"
            >
              {rootPost.stats.comments}
            </Button>
            <PostRepost post={rootPost} />
          </div>
          <Button
            variant="tertiary"
            onClick={() => toast.success('Coming soon')}
            iconLeft="icon-share"
            className="rounded-full"
          />
        </div>
      </div>
      {/* <PostComments postId={rootPost.id} feedAddress={rootPost.feed?.address} /> */}
    </div>
  );
}
