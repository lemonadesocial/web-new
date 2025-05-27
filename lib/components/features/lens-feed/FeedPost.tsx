import { ImageMetadata, Post, Repost, TextOnlyMetadata } from "@lens-protocol/client";
import { formatDistanceToNow } from "date-fns";

import { Avatar } from "$lib/components/core";
import { randomUserImage } from "$lib/utils/user";

import { FeedPostGallery } from './FeedPostGallery';
import { PostReaction } from "./PostReaction";
import { PostRepost } from "./PostRepost";

type FeedPostProps = {
  post: Post | Repost;
};

export function FeedPost({ post }: FeedPostProps) {
  const { author, timestamp } = post;
  const rootPost = post.__typename === 'Repost' ? post.repostOf : post;
  const metadata = rootPost.metadata;

  return (
    <div className="bg-card rounded-md border border-card-border px-4 py-3 space-y-3">
      <div className="flex gap-3">
        <Avatar
          src={author.metadata?.picture || randomUserImage(author.owner)}
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
      <p className="text-secondary">{(metadata as TextOnlyMetadata).content}</p>
      {(metadata as ImageMetadata).attachments?.length > 0 && (
        <FeedPostGallery attachments={(metadata as ImageMetadata).attachments.map(({ item }) => item)} />
      )}
      <div className="flex gap-2">
        <PostReaction post={rootPost} />
        <PostRepost post={rootPost} />
      </div>
    </div>
  );
}
