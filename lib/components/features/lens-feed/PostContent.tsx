import { ImageMetadata, LinkMetadata, Post, TextOnlyMetadata } from "@lens-protocol/client";

import { FeedPostGallery } from "./FeedPostGallery";
import { EventPreview } from "./EventPreview";

type PostContentProps = {
  post: Post;
};

export function PostContent({ post }: PostContentProps) {
  const { metadata } = post;

  return (
    <div className="space-y-2">
      <p className="text-secondary whitespace-pre-line">{(metadata as TextOnlyMetadata).content}</p>
      {(metadata as ImageMetadata).attachments?.length > 0 && (
        <FeedPostGallery attachments={(metadata as ImageMetadata).attachments.map(({ item }) => item)} />
      )}
      {
        (metadata as LinkMetadata).sharingLink && (
          <EventPreview url={(metadata as LinkMetadata).sharingLink} />
        )
      }
    </div>
  );
}
