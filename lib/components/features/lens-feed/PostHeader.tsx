import { Post } from "@lens-protocol/client";
import { formatDistanceToNow } from "date-fns";

import { Avatar } from "$lib/components/core";
import { getAccountAvatar } from "$lib/utils/lens/utils";

type PostHeaderProps = {
  post: Post;
};

export function PostHeader({ post }: PostHeaderProps) {
  const { author, timestamp } = post;

  return (
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
  );
}
