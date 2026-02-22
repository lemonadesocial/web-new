import React from 'react';
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
// Stub PageConfig hook (dev only — replaced by real query once backend is live)
// ---------------------------------------------------------------------------

/**
 * Returns a minimal PageConfig stub for editor development.
 *
 * In production this will be replaced by a proper GraphQL query
 * (getPageConfig / createPageConfig) once the backend mutations are live.
 */
export function useStubPageConfig(ownerId: string, ownerType: OwnerType): PageConfig {
  return React.useMemo<PageConfig>(
    () => ({
      _id: `stub_${ownerId}`,
      owner_type: ownerType,
      owner_id: ownerId,
      created_by: '',
      status: 'draft',
      version: 1,
      theme: DEFAULT_THEME,
      sections: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
    [ownerId, ownerType],
  );
}
