'use client';

import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import clsx from 'clsx';

import { Button, Skeleton, Badge } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { drawer } from '$lib/components/core/dialog';
import { toast } from '$lib/components/core/toast';

import { pageConfigAtom, configIdAtom, isDirtyAtom } from '../store';
import type { ConfigVersion, PageConfig } from '../types';
// TODO: Wire GraphQL queries once backend is ready
// import { LIST_CONFIG_VERSIONS, SAVE_CONFIG_VERSION, RESTORE_CONFIG_VERSION } from '../queries';

// ---------------------------------------------------------------------------
// Mock Data (TODO: Replace with LIST_CONFIG_VERSIONS query)
// ---------------------------------------------------------------------------

const MOCK_VERSIONS: ConfigVersion[] = [
  {
    _id: 'v3',
    config_id: 'cfg1',
    version: 3,
    snapshot: {} as PageConfig,
    change_summary: 'Updated hero section',
    created_by: 'user1',
    created_at: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    _id: 'v2',
    config_id: 'cfg1',
    version: 2,
    snapshot: {} as PageConfig,
    change_summary: 'Added schedule section',
    created_by: 'user1',
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    _id: 'v1',
    config_id: 'cfg1',
    version: 1,
    snapshot: {} as PageConfig,
    change_summary: 'Initial creation',
    created_by: 'user1',
    created_at: new Date(Date.now() - 172_800_000).toISOString(),
  },
];

import { formatRelativeTime } from '../utils';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function VersionItemSkeleton() {
  return (
    <div className="p-3 space-y-2 border-b border-card-border last:border-b-0">
      <div className="flex items-center gap-2">
        <Skeleton animate className="h-4 w-8 rounded-full" />
        <Skeleton animate className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton animate className="h-3 w-3/4 rounded-full" />
      <Skeleton animate className="h-3 w-1/3 rounded-full" />
      <div className="flex gap-2 pt-1">
        <Skeleton animate className="h-7 w-16 rounded-sm" />
        <Skeleton animate className="h-7 w-16 rounded-sm" />
      </div>
    </div>
  );
}

function VersionItem({
  version,
  isCurrentDraft,
  isPublished,
  isRestoring,
  onRestore,
}: {
  version: ConfigVersion;
  isCurrentDraft: boolean;
  isPublished: boolean;
  isRestoring: boolean;
  onRestore: (version: ConfigVersion) => void;
}) {
  return (
    <div className="p-3 space-y-2 border-b border-card-border last:border-b-0">
      {/* Header row: version number + status badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-primary">v{version.version}</span>
        {isCurrentDraft && (
          <Badge color="#3b82f6" className="text-[10px] py-0.5">
            Current
          </Badge>
        )}
        {isPublished && (
          <Badge color="#22c55e" className="text-[10px] py-0.5">
            Published
          </Badge>
        )}
      </div>

      {/* Change summary */}
      {version.change_summary && (
        <p className="text-sm text-secondary">{version.change_summary}</p>
      )}

      {/* Timestamp + creator */}
      <div className="flex items-center gap-2 text-xs text-tertiary">
        <span>{formatRelativeTime(version.created_at)}</span>
        <span className="text-primary/12">|</span>
        <span>{version.created_by === 'user1' ? 'You' : version.created_by}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {!isCurrentDraft && (
          <Button
            variant="tertiary-alt"
            size="xs"
            onClick={() => onRestore(version)}
            loading={isRestoring}
          >
            Restore
          </Button>
        )}
        <Button variant="flat" size="xs" disabled title="Compare versions (coming soon)">
          Compare
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VersionHistoryPanel
// ---------------------------------------------------------------------------

/**
 * VersionHistoryPanel - Right-drawer panel for browsing and restoring page versions.
 *
 * Features:
 * - Chronological list of saved versions with status badges
 * - Save Version button to create manual save points
 * - Restore capability with confirmation dialog
 * - Compare placeholder for future diff view
 * - Loading skeletons and empty state
 */
export function VersionHistoryPanel() {
  const configId = useAtomValue(configIdAtom);
  const config = useAtomValue(pageConfigAtom);
  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);

  const [versions, setVersions] = React.useState<ConfigVersion[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSavingVersion, setIsSavingVersion] = React.useState(false);
  const [restoringVersionId, setRestoringVersionId] = React.useState<string | null>(null);
  const [changeSummary, setChangeSummary] = React.useState('');

  const currentVersion = config?.version ?? 0;
  const publishedVersion = config?.published_version;

  // --- Fetch versions ---
  // TODO: Replace with real LIST_CONFIG_VERSIONS query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVersions(MOCK_VERSIONS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [configId]);

  // --- Save version ---
  const handleSaveVersion = async () => {
    if (!configId) {
      toast.error('No config loaded. Save your page first.');
      return;
    }

    setIsSavingVersion(true);

    try {
      // TODO: Replace with SAVE_CONFIG_VERSION mutation
      // const response = await graphqlClient.request(SAVE_CONFIG_VERSION, {
      //   configId,
      //   changeSummary: changeSummary || undefined,
      // });
      // const newVersion = response.saveConfigVersion;

      // Mock response
      const nextVersion = versions.length > 0 ? versions[0].version + 1 : 1;
      const newVersion: ConfigVersion = {
        _id: `v${nextVersion}`,
        config_id: configId,
        version: nextVersion,
        snapshot: config as PageConfig,
        change_summary: changeSummary || undefined,
        created_by: 'user1',
        created_at: new Date().toISOString(),
      };

      setVersions((prev) => [newVersion, ...prev]);
      setChangeSummary('');
      toast.success(`Version v${nextVersion} saved`);
    } catch {
      toast.error('Failed to save version.');
    } finally {
      setIsSavingVersion(false);
    }
  };

  // --- Restore version ---
  const handleRestore = async (version: ConfigVersion) => {
    const confirmed = window.confirm(
      `Restore to version ${version.version}? This will replace your current draft.`,
    );
    if (!confirmed) return;

    setRestoringVersionId(version._id);

    try {
      // TODO: Replace with RESTORE_CONFIG_VERSION mutation
      // const response = await graphqlClient.request(RESTORE_CONFIG_VERSION, {
      //   configId,
      //   version: version.version,
      // });
      // setPageConfig(response.restoreConfigVersion);

      // Mock: apply snapshot
      if (version.snapshot && Object.keys(version.snapshot).length > 0) {
        setPageConfig(version.snapshot);
      }

      setIsDirty(true);
      toast.success(`Restored to v${version.version}`);
    } catch {
      toast.error('Failed to restore version.');
    } finally {
      setRestoringVersionId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-2 border-b bg-overlay-secondary backdrop-blur-2xl z-10">
        <span className="text-sm font-medium text-primary">Version History</span>
        <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
      </div>

      {/* --- Save Version Section --- */}
      <div className="px-4 pt-3 pb-3 space-y-2 border-b border-card-border">
        <InputField
          placeholder="Change summary (optional)"
          value={changeSummary}
          onChangeText={setChangeSummary}
        />
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={handleSaveVersion}
          loading={isSavingVersion}
          disabled={isSavingVersion || !configId}
        >
          Save Version
        </Button>
      </div>

      {/* --- Version List --- */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <VersionItemSkeleton key={i} />
            ))}
          </div>
        ) : versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 px-4">
            <i className="icon-clock size-8 text-tertiary" />
            <p className="text-sm text-tertiary text-center">
              No versions saved yet. Save a version to create a restore point.
            </p>
          </div>
        ) : (
          <div>
            {versions.map((version) => (
              <VersionItem
                key={version._id}
                version={version}
                isCurrentDraft={version.version === currentVersion}
                isPublished={version.version === publishedVersion}
                isRestoring={restoringVersionId === version._id}
                onRestore={handleRestore}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
