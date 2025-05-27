import { Avatar } from "$lib/components/core";
import { randomUserImage, userAvatar } from "$lib/utils/user";
import { formatDistanceToNow } from "date-fns";
import { ImageMetadata, Post, TextOnlyMetadata } from "@lens-protocol/client";
import { FeedPostGallery } from './FeedPostGallery';

type FeedPostProps = {
  post: Post;
};

export function FeedPost({ post }: FeedPostProps) {
  const { author, metadata, timestamp, stats } = post;

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
            {author.metadata?.name || author.username?.localName}
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
    </div>
  );
}
