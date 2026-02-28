'use client';

import React from 'react';
import { useSetAtom } from 'jotai';

import { Button } from '$lib/components/core';
import { toast } from '$lib/components/core/toast';
import { useQuery, useMutation } from '$lib/graphql/request/hooks';
import {
  CheckTemplateUpdateDocument,
  ApplyTemplateUpdateDocument,
} from '$lib/graphql/generated/backend/graphql';

import { pageConfigAtom, isDirtyAtom } from '../store';
import { classifyError, pbEvent, toastMessageFor } from '../observability';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TemplateUpdateBannerProps {
  configId: string;
  templateId?: string;
}

// ---------------------------------------------------------------------------
// TemplateUpdateBanner
// ---------------------------------------------------------------------------

/**
 * TemplateUpdateBanner - Info banner shown at the top of the editor when
 * the template used by the current config has a newer version available.
 *
 * Features:
 * - Checks for template updates via CheckTemplateUpdateDocument
 * - Shows dismissible info banner with version diff
 * - "View Changes" to expand changelog summary inline
 * - "Update Now" button to apply the template update
 * - "Dismiss" to hide for this session
 */
export function TemplateUpdateBanner({ configId, templateId }: TemplateUpdateBannerProps) {
  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);

  const [isDismissed, setIsDismissed] = React.useState(false);
  const [showChangelog, setShowChangelog] = React.useState(false);

  // --- Check for updates ---
  const { data, loading, refetch } = useQuery(CheckTemplateUpdateDocument, {
    variables: { config_id: configId },
    skip: !templateId,
  });

  const updateInfo = data?.checkTemplateUpdate ?? null;

  // --- Apply update ---
  const [applyUpdate, { loading: isUpdating }] = useMutation(ApplyTemplateUpdateDocument);

  const handleUpdate = async () => {
    try {
      const { data: mutationData, error } = await applyUpdate({
        variables: { config_id: configId },
      });

      if (error) throw error;

      const updatedConfig = mutationData?.applyTemplateUpdate;
      if (updatedConfig) {
        setPageConfig(updatedConfig);
      }

      setIsDirty(true);
      refetch();
      toast.success(
        `Template updated from v${updateInfo?.current_version} to v${updateInfo?.latest_version}`,
      );
    } catch (err) {
      const ec = classifyError(err);
      pbEvent({ op: 'template_update', errorClass: ec, message: 'Template update failed', configId });
      toast.error(toastMessageFor('Failed to apply template update.', ec));
    }
  };

  // --- Dismiss handler ---
  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // --- Render nothing if no template, no update, loading, or dismissed ---
  if (!templateId || isDismissed || loading || !updateInfo?.available) {
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

      {/* Changelog summary (expandable) */}
      {showChangelog && (updateInfo.changelog_summary || updateInfo.breaking_changes) && (
        <div className="mt-2 text-xs text-primary/70 pl-3 border-l-2 border-blue-500/30">
          {updateInfo.changelog_summary && (
            <p>{updateInfo.changelog_summary}</p>
          )}
          {updateInfo.breaking_changes && (
            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-xs bg-danger-500/12 text-danger-400 font-medium">
              Breaking changes
            </span>
          )}
        </div>
      )}
    </div>
  );
}
