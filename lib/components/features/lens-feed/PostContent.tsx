import { EventMetadata, ImageMetadata, LinkMetadata, Post, TextOnlyMetadata } from '@lens-protocol/client';
import { useState, useEffect } from 'react';

import { FeedPostGallery } from './FeedPostGallery';
import { EventPreview } from './EventPreview';
import { GetEventDocument, Event } from '$lib/graphql/generated/backend/graphql';
import { defaultClient } from '$lib/graphql/request/instances';
import { LinkPreview } from '$lib/components/core/link';
import { markdownToHtml } from '$lib/utils/markdown';

type PostContentProps = {
  post: Post;
};

export function PostContent({ post }: PostContentProps) {
  const { metadata } = post;
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      let shortid: string | null = null;

      if (metadata.__typename === 'EventMetadata') {
        const eventMetadata = metadata as EventMetadata;
        if (typeof eventMetadata.location === 'string') {
          shortid = eventMetadata.location;
        } else if (
          eventMetadata.location &&
          typeof eventMetadata.location === 'object' &&
          'physical' in eventMetadata.location
        ) {
          shortid = eventMetadata.location.physical;
        }
      }

      if (shortid) {
        const { data } = await defaultClient.query({
          query: GetEventDocument,
          variables: { shortid },
          fetchPolicy: 'network-only',
        });
        if (data?.getEvent) {
          setEvent(data.getEvent as Event);
        }
      }
    };

    fetchEvent();
  }, [metadata]);

  const extractFirstUrl = (content?: string): string | null => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const matches = content?.match(urlRegex);
    return matches ? matches[0] : null;
  };

  const sharingLink = (metadata as LinkMetadata).sharingLink || extractFirstUrl((metadata as TextOnlyMetadata).content);

  return (
    <div className="space-y-2" style={{ overflowWrap: 'anywhere' }}>
      <div
        className="text-secondary font-medium [&_a]:text-accent-400"
        dangerouslySetInnerHTML={{
          __html: markdownToHtml((metadata as TextOnlyMetadata).content || '')
        }}
      />
      {(metadata as ImageMetadata).attachments && (metadata as ImageMetadata).attachments.length > 0 && (
        <FeedPostGallery attachments={(metadata as ImageMetadata).attachments.map(({ item }) => item)} />
      )}
      {event && <EventPreview event={event} />}
      {/* {sharingLink && <UrlPreview url={sharingLink} />} */}
      {sharingLink && <LinkPreview url={sharingLink} />}
    </div>
  );
}
