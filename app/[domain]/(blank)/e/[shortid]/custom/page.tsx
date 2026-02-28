import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { htmlToText } from 'html-to-text';

import { Event, GetEventDocument, GetPublishedConfigDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { ConfigRuntime } from '$lib/components/features/page-builder/ConfigRuntime';
import type { PageConfig } from '$lib/components/features/page-builder/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ shortid: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchEventAndConfig(shortid: string) {
  const client = getClient();

  // 1. Fetch event to get its _id
  const { data: eventData } = await client.query({
    query: GetEventDocument,
    variables: { shortid },
  });
  const event = eventData?.getEvent as Event | undefined;

  if (!event) return { event: null, config: null };

  // 2. Fetch published PageConfig for this event
  try {
    const { data: configData } = await client.query({
      query: GetPublishedConfigDocument,
      variables: { owner_type: 'event', owner_id: event._id },
    });

    const config = configData?.getPublishedConfig as PageConfig | null;

    return { event, config };
  } catch (err) {
    console.error('[page-builder] Failed to fetch published config for event', event._id, err);
    return { event, config: null };
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const shortid = (await params).shortid;
  const { event, config } = await fetchEventAndConfig(shortid);

  if (!event) return {};

  const previousImages = (await parent).openGraph?.images || [];

  // Prefer SEO overrides from the PageConfig when available
  const seo = config?.seo;

  const title = seo?.meta_title || event.title;
  const description = seo?.meta_description || (
    event.description
      ? htmlToText(event.description, {
          selectors: [
            { selector: 'img', format: 'skip' },
            { selector: 'hr', format: 'skip' },
            { selector: 'h1', format: 'skip' },
            { selector: 'h2', format: 'skip' },
          ],
        })
      : ''
  );

  let images = [...previousImages];
  if (seo?.og_image_url) {
    images = [seo.og_image_url, ...images];
  } else {
    // Fall back to the default event OG image
    images = [
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/og/event/${event.shortid}`,
      ...images,
    ];
  }

  const metadata: Metadata = {
    metadataBase: null,
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: (seo?.og_type as 'website' | 'article') || 'website',
    },
  };

  if (seo?.canonical_url) {
    metadata.alternates = { canonical: seo.canonical_url };
  }

  if (seo?.no_index) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CustomEventPage({ params }: PageProps) {
  const shortid = (await params).shortid;
  const { event, config } = await fetchEventAndConfig(shortid);

  // No event found at all
  if (!event) return notFound();

  // No published custom page — redirect to the regular event page
  if (!config) {
    redirect(`/e/${shortid}`);
  }

  return (
    <div className="min-h-dvh">
      <ConfigRuntime config={config} />
    </div>
  );
}
