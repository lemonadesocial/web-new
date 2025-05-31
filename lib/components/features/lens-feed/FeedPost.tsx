import { ImageMetadata, Post, Repost, TextOnlyMetadata } from "@lens-protocol/client";
import { formatDistanceToNow } from "date-fns";

import { Avatar, toast } from "$lib/components/core";
import { getAccountAvatar } from "$lib/utils/lens/utils";

import { FeedPostGallery } from './FeedPostGallery';
import { PostReaction } from "./PostReaction";
import { PostRepost } from "./PostRepost";
import { PostButton } from "./PostButton";
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostComment } from "./PostComment";

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
          <PostHeader post={rootPost} />
          <div className="flex gap-2">
            <PostButton
              icon="icon-upload"
              onClick={() => toast.success('Coming soon')}
            />
            <PostButton
              icon="icon-more-vert"
              onClick={() => toast.success('Coming soon')}
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
            onClick={() => toast.success('Coming soon')}
          />
        </div>
      </div>
      {/* <PostComments postId={rootPost.id} feedAddress={rootPost.feed?.address} /> */}
    </div>
  );
}
