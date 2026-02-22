'use client';

import React from 'react';
import { useSetAtom } from 'jotai';

import { Button } from '$lib/components/core';
import { toast } from '$lib/components/core/toast';

import { pageConfigAtom, isDirtyAtom } from '../store';
import type { TemplateUpdateInfo, TemplateChangelog } from '../types';
// TODO: Wire GraphQL queries (use generated CheckTemplateUpdateDocument / ApplyTemplateUpdateDocument)

// ---------------------------------------------------------------------------
// Mock Data (TODO: Replace with CHECK_TEMPLATE_UPDATE query)
// ---------------------------------------------------------------------------

const MOCK_UPDATE_INFO: TemplateUpdateInfo = {
  has_update: true,
  current_version: '1.2',
  latest_version: '1.3',
  changelog: [
    {
      version: '1.3',
      date: '2026-02-20',
      summary: 'Added mobile optimization and new color schemes',
      breaking_changes: false,
    },
    {
      version: '1.2.1',
      date: '2026-02-10',
      summary: 'Fixed layout issues on tablet viewports',
      breaking_changes: false,
    },
  ],
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TemplateUpdateBannerProps {
  configId: string;
  templateId?: string;
}

// ---------------------------------------------------------------------------
// Changelog Sub-component
// ---------------------------------------------------------------------------

function ChangelogList({ changelog }: { changelog: TemplateChangelog[] }) {
  return (
    <div className="mt-2 space-y-2">
      {changelog.map((entry) => (
        <div
          key={entry.version}
          className="text-xs text-primary/70 pl-3 border-l-2 border-blue-500/30"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary/90">v{entry.version}</span>
            <span className="text-tertiary">{entry.date}</span>
            {entry.breaking_changes && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-danger-500/12 text-danger-400 font-medium">
                Breaking
              </span>
            )}
          </div>
          <p className="mt-0.5">{entry.summary}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TemplateUpdateBanner
// ---------------------------------------------------------------------------

/**
 * TemplateUpdateBanner - Info banner shown at the top of the editor when
 * the template used by the current config has a newer version available.
 *
 * Features:
 * - Checks for template updates on mount (if config has template_id)
 * - Shows dismissible info banner with version diff
 * - "View Changes" to expand changelog inline
 * - "Update Now" button to apply the template update
 * - "Dismiss" to hide for this session
 */
export function TemplateUpdateBanner({ configId, templateId }: TemplateUpdateBannerProps) {
  const _setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);

  const [updateInfo, setUpdateInfo] = React.useState<TemplateUpdateInfo | null>(null);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showChangelog, setShowChangelog] = React.useState(false);

  // --- Check for updates on mount ---
  React.useEffect(() => {
    if (!templateId) return;

    const checkForUpdates = async () => {
      setIsChecking(true);
      try {
        // TODO: Replace with CHECK_TEMPLATE_UPDATE query
        // const response = await graphqlClient.request(CHECK_TEMPLATE_UPDATE, {
        //   configId,
        //   templateId,
        // });
        // setUpdateInfo(response.checkTemplateUpdate);

        // Mock: simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        setUpdateInfo(MOCK_UPDATE_INFO);
      } catch {
        // Silently fail — this is a non-critical check
      } finally {
        setIsChecking(false);
      }
    };

    checkForUpdates();
  }, [configId, templateId]);

  // --- Apply update ---
  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      // TODO: Replace with APPLY_TEMPLATE_UPDATE mutation
      // const response = await graphqlClient.request(APPLY_TEMPLATE_UPDATE, {
      //   configId,
      //   templateId,
      // });
      // setPageConfig(response.applyTemplateUpdate);

      // Mock success
      await new Promise((resolve) => setTimeout(resolve, 600));

      setIsDirty(true);
      setUpdateInfo(null);
      toast.success(
        `Template updated from v${updateInfo?.current_version} to v${updateInfo?.latest_version}`,
      );
    } catch {
      toast.error('Failed to apply template update.');
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Dismiss handler ---
  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // --- Render nothing if no template, no update, or dismissed ---
  if (!templateId || isDismissed || isChecking || !updateInfo?.has_update) {
    return null;
  }

  return (
    <div className="bg-blue-500/8 border border-blue-500/20 rounded-md text-sm px-4 py-2.5">
      {/* Main row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <i className="icon-package size-4 text-blue-400 shrink-0" />
          <span className="text-primary truncate">
            Template update{' '}
            <span className="font-medium">
              v{updateInfo.current_version} → v{updateInfo.latest_version}
            </span>{' '}
            available.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="text-xs text-blue-400 hover:text-blue-300 transition cursor-pointer whitespace-nowrap"
            onClick={() => setShowChangelog((prev) => !prev)}
            type="button"
          >
            {showChangelog ? 'Hide Changes' : 'View Changes'}
          </button>
          <Button
            variant="tertiary-alt"
            size="xs"
            onClick={handleUpdate}
            loading={isUpdating}
          >
            Update Now
          </Button>
          <button
            className="text-tertiary hover:text-secondary transition cursor-pointer"
            onClick={handleDismiss}
            title="Dismiss"
            type="button"
          >
            <i className="icon-x size-4" />
          </button>
        </div>
      </div>

      {/* Changelog (expandable) */}
      {showChangelog && updateInfo.changelog && updateInfo.changelog.length > 0 && (
        <ChangelogList changelog={updateInfo.changelog} />
      )}
    </div>
  );
}
