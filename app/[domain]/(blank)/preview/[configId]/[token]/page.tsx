import { Metadata } from 'next';
import Link from 'next/link';

import { getClient } from '$lib/graphql/request';
import { ConfigRuntime } from '$lib/components/features/page-builder/ConfigRuntime';
import { VALIDATE_PREVIEW_LINK } from '$lib/components/features/page-builder/queries';
import type { PageConfig } from '$lib/components/features/page-builder/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ configId: string; token: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function validatePreview(configId: string, token: string) {
  const client = getClient();

  try {
    const { data, error } = await client.query({
      query: VALIDATE_PREVIEW_LINK,
      variables: { configId, token },
    });

    if (error) return { config: null, error: error.message ?? 'Invalid preview link' };

    const config = (data as Record<string, unknown>)
      ?.validatePreviewLink as PageConfig | null;

    if (!config) return { config: null, error: 'Preview link is invalid or has expired' };

    return { config, error: null };
  } catch {
    return { config: null, error: 'Unable to validate preview link' };
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { configId, token } = await params;
  const { config } = await validatePreview(configId, token);

  if (!config) {
    return {
      title: 'Preview Unavailable',
      robots: { index: false, follow: false },
    };
  }

  const seo = config.seo;

  return {
    title: seo?.meta_title || config.name || 'Page Preview',
    description: seo?.meta_description || config.description || '',
    robots: { index: false, follow: false },
    openGraph: seo?.og_image_url
      ? {
          images: seo.og_image_url,
          type: (seo.og_type as 'website' | 'article') || 'website',
        }
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PreviewPage({ params }: PageProps) {
  const { configId, token } = await params;
  const { config, error } = await validatePreview(configId, token);

  if (!config) {
    return <PreviewError message={error ?? 'Preview link is invalid or has expired'} />;
  }

  return (
    <div className="min-h-dvh">
      {/* Preview banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500/90 px-4 py-2 text-sm font-medium text-black backdrop-blur-sm">
        <i className="icon-eye size-4" />
        <span>Preview Mode — This page has not been published yet</span>
      </div>

      <ConfigRuntime config={config} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

function PreviewError({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-950 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-neutral-800">
          <i className="icon-link-broken size-8 text-neutral-400" />
        </div>

        <h1 className="mb-2 text-xl font-semibold text-white">
          Preview Unavailable
        </h1>

        <p className="mb-8 text-sm text-neutral-400">{message}</p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
