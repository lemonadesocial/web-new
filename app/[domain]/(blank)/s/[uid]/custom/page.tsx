import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { isObjectId } from '$lib/utils/helpers';
import { generateUrl } from '$lib/utils/cnd';
import { ConfigRuntime } from '$lib/components/features/page-builder/ConfigRuntime';
import { GET_PUBLISHED_CONFIG } from '$lib/components/features/page-builder/queries';
import type { PageConfig } from '$lib/components/features/page-builder/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ uid: string; domain: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchSpaceAndConfig(uid: string) {
  const client = getClient();
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  // 1. Fetch space
  const { data: spaceData } = await client.query({
    query: GetSpaceDocument,
    variables,
  });
  const space = spaceData?.getSpace as Space | undefined;

  if (!space) return { space: null, config: null };

  // 2. Fetch published PageConfig for this space
  try {
    const { data: configData } = await client.query({
      query: GET_PUBLISHED_CONFIG,
      variables: { ownerType: 'space', ownerId: space._id },
    });

    const config = (configData as Record<string, unknown>)
      ?.getPublishedConfig as PageConfig | null;

    return { space, config };
  } catch {
    // If the query fails (e.g. backend branch not deployed yet), fall back
    return { space, config: null };
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { uid } = await params;
  const { space, config } = await fetchSpaceAndConfig(uid);

  if (!space) return {};

  const previousImages = (await parent).openGraph?.images || [];
  const seo = config?.seo;

  // Prefer SEO overrides from the PageConfig when available
  const title = seo?.meta_title || space.title;
  const description = seo?.meta_description || space.description || '';

  let images = [...previousImages];
  if (seo?.og_image_url) {
    images = [seo.og_image_url, ...images];
  } else if (space.image_cover_expanded) {
    images = [generateUrl(space.image_cover_expanded), ...images];
  }

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: (seo?.og_type as 'website' | 'article') || 'website',
    },
  };

  if (space.fav_icon_url) {
    metadata.icons = {
      icon: space.fav_icon_url,
      shortcut: space.fav_icon_url,
      apple: space.fav_icon_url,
    };
  }

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

export default async function CustomSpacePage({ params }: PageProps) {
  const { uid } = await params;
  const { space, config } = await fetchSpaceAndConfig(uid);

  // No space found at all
  if (!space) return notFound();

  // No published custom page — redirect to the regular space page
  if (!config) {
    redirect(`/s/${uid}`);
  }

  return (
    <div className="min-h-dvh">
      <ConfigRuntime config={config} />
    </div>
  );
}
