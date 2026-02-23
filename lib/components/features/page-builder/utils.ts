import React from 'react';
import { defaultClient } from '$lib/graphql/request/instances';
import {
  GetPageConfigDocument,
  CreatePageConfigDocument,
} from '$lib/graphql/generated/backend/graphql';

import type { PageConfig, OwnerType } from './types';
import { DEFAULT_THEME } from './types';

// ---------------------------------------------------------------------------
// Time formatting
// ---------------------------------------------------------------------------

/**
 * Formats a date string into a human-friendly relative time.
 * e.g. "Just now", "5m ago", "3h ago", "2d ago", "Yesterday", or a locale date.
 */
export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;

  return new Date(dateString).toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------

/**
 * Formats large install counts with `k` suffix. e.g. 1240 → "1.2k"
 */
export function formatInstallCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(count);
}

/**
 * Renders a star rating as Unicode characters. e.g. 4.5 → "★★★★½"
 */
export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return '\u2605'.repeat(full) + (half ? '\u00BD' : '');
}

// ---------------------------------------------------------------------------
// PageConfig hook — find-or-create for the editor
// ---------------------------------------------------------------------------

const CONFIG_ID_PREFIX = 'pb_config_';

function getCachedConfigId(ownerType: OwnerType, ownerId: string): string | null {
  try {
    return localStorage.getItem(`${CONFIG_ID_PREFIX}${ownerType}_${ownerId}`);
  } catch {
    return null;
  }
}

function setCachedConfigId(ownerType: OwnerType, ownerId: string, configId: string) {
  try {
    localStorage.setItem(`${CONFIG_ID_PREFIX}${ownerType}_${ownerId}`, configId);
  } catch {
    // localStorage unavailable — non-critical
  }
}

/**
 * Fetches (or creates) a PageConfig for the given owner.
 *
 * 1. Checks localStorage for a previously resolved config ID.
 * 2. If found, loads it via `getPageConfig`.
 * 3. If not found (or the config was deleted), creates a new draft
 *    via `createPageConfig` and caches the ID.
 */
export function usePageConfig(
  ownerId: string,
  ownerType: OwnerType,
): { config: PageConfig | null; loading: boolean; error: unknown } {
  const [config, setConfig] = React.useState<PageConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(null);

  React.useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function resolve() {
      setLoading(true);
      setError(null);

      try {
        // 1. Check localStorage for a cached config ID
        const cachedId = getCachedConfigId(ownerType, ownerId);

        if (cachedId) {
          // 2. Try to load the existing config
          const { data } = await defaultClient.query({
            query: GetPageConfigDocument,
            variables: { id: cachedId },
            fetchPolicy: 'network-only',
          });

          const existing = data?.getPageConfig as PageConfig | null;

          if (!cancelled && existing) {
            setConfig(existing);
            setLoading(false);
            return;
          }

          // Cached ID was stale — fall through to create
        }

        // 3. No cached config (or it was deleted) — create a new draft
        const { data: createData } = await defaultClient.query({
          query: CreatePageConfigDocument,
          variables: {
            input: {
              owner_type: ownerType,
              owner_id: ownerId,
              theme: DEFAULT_THEME,
            },
          },
          fetchPolicy: 'network-only',
        });

        const created = createData?.createPageConfig as PageConfig | null;

        if (!cancelled && created) {
          setCachedConfigId(ownerType, ownerId, created._id);
          setConfig(created);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };
  }, [ownerId, ownerType]);

  return { config, loading, error };
}
