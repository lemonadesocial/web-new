'use client';

import React from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { debounce } from 'lodash';
import { toast } from '$lib/components/core';

import {
  configIdAtom,
  ownerTypeAtom,
  ownerIdAtom,
  isDirtyAtom,
  isSavingAtom,
  isPublishingAtom,
  isLockedAtom,
  pageConfigAtom,
} from './store';
import type { OwnerType, PageConfig } from './types';
import { TopToolbar } from './TopToolbar';
import { Canvas } from './Canvas';
import { BottomBar } from './BottomBar';

// ── Lock lifecycle constants ──

const LOCK_HEARTBEAT_INTERVAL_MS = 60_000; // 60 seconds

// ── Props ──

export interface PageBuilderEditorProps {
  /** The PageConfig loaded from the server */
  config: PageConfig;
  /** Owner type for this editor session */
  ownerType: OwnerType;
  /** Owner ID (event._id or space._id) */
  ownerId: string;
  /** Display name for the entity being edited */
  entityName: string;
  /** Path to navigate back to (e.g. `/agent/e/manage/{shortid}`) */
  backHref: string;
}

/**
 * PageBuilderEditor — main editor shell.
 *
 * Responsibilities:
 *  1. Hydrate Jotai atoms from the loaded PageConfig.
 *  2. When Craft.js is integrated, wrap content in `<Editor resolver={sectionResolver}>`.
 *  3. Auto-save: debounce config changes by 2 s, call updatePageConfig mutation.
 *  4. Lock lifecycle: acquireConfigLock on mount, heartbeat every 60 s,
 *     releaseConfigLock on unmount + beforeunload.
 *  5. Render: TopToolbar, Canvas, BottomBar.
 */
export function PageBuilderEditor({
  config,
  ownerType,
  ownerId,
  entityName,
  backHref,
}: PageBuilderEditorProps) {
  // ── Atom setters ──
  const setConfigId = useSetAtom(configIdAtom);
  const setOwnerType = useSetAtom(ownerTypeAtom);
  const setOwnerId = useSetAtom(ownerIdAtom);
  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);
  const setIsSaving = useSetAtom(isSavingAtom);
  const setIsPublishing = useSetAtom(isPublishingAtom);
  const setIsLocked = useSetAtom(isLockedAtom);

  const isDirty = useAtomValue(isDirtyAtom);

  // ── Hydrate atoms on mount ──
  React.useEffect(() => {
    setConfigId(config._id);
    setOwnerType(ownerType);
    setOwnerId(ownerId);
    setPageConfig(config);
    setIsDirty(false);
  }, [config._id, ownerType, ownerId]);

  // ── Lock lifecycle ──
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally keyed on config._id only; we re-acquire the lock when the config changes, not when callbacks update.
  React.useEffect(() => {
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    const acquireLock = async () => {
      try {
        // TODO: Call acquireConfigLock GraphQL mutation
        // const result = await acquireConfigLock({ variables: { configId: config._id } });
        // if (result.success) setIsLocked(true);
        setIsLocked(true);
      } catch {
        toast.error('Could not acquire editor lock. Another user may be editing.');
      }
    };

    const heartbeat = async () => {
      try {
        // TODO: Call heartbeatConfigLock GraphQL mutation
        // await heartbeatConfigLock({ variables: { configId: config._id } });
      } catch {
        // Lock lost — inform user
        setIsLocked(false);
        toast.error('Editor lock lost. Your changes may not save.');
      }
    };

    const releaseLock = async () => {
      try {
        // TODO: Call releaseConfigLock GraphQL mutation
        // await releaseConfigLock({ variables: { configId: config._id } });
        setIsLocked(false);
      } catch {
        // Best effort — ignore on unmount
      }
    };

    acquireLock();
    heartbeatTimer = setInterval(heartbeat, LOCK_HEARTBEAT_INTERVAL_MS);

    // Release lock on page unload
    const handleBeforeUnload = () => {
      releaseLock();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      releaseLock();
    };
  }, [config._id]);

  // ── Auto-save (debounced) ──
  const debouncedSave = React.useMemo(
    () =>
      debounce(async (configSnapshot: PageConfig) => {
        try {
          setIsSaving(true);
          // TODO: Call updatePageConfig GraphQL mutation
          // await updatePageConfig({ variables: { id: configSnapshot._id, input: configSnapshot } });
          setIsDirty(false);
        } catch (err) {
          toast.error('Auto-save failed. Your work is still in memory.');
        } finally {
          setIsSaving(false);
        }
      }, 2_000),
    [],
  );

  // Watch for dirty flag -> trigger auto-save
  const pageConfig = useAtomValue(pageConfigAtom);
  React.useEffect(() => {
    if (isDirty && pageConfig) {
      debouncedSave(pageConfig);
    }
    return () => debouncedSave.cancel();
  }, [isDirty, pageConfig]);

  // ── Save / Publish handlers ──

  const handleSave = async () => {
    if (!pageConfig) return;
    try {
      setIsSaving(true);
      debouncedSave.cancel();
      // TODO: Call updatePageConfig GraphQL mutation
      // await updatePageConfig({ variables: { id: pageConfig._id, input: pageConfig } });
      setIsDirty(false);
      toast.success('Draft saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!pageConfig) return;
    try {
      setIsPublishing(true);
      // Save first
      debouncedSave.cancel();
      // TODO: Call updatePageConfig then publishPageConfig GraphQL mutations
      // await updatePageConfig({ variables: { id: pageConfig._id, input: pageConfig } });
      // await publishPageConfig({ variables: { configId: pageConfig._id } });
      setIsDirty(false);
      toast.success('Page published successfully!');
    } catch {
      toast.error('Publish failed');
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Render ──
  // Once Craft.js is installed, wrap this in:
  //   <CraftEditor resolver={sectionResolver} enabled={true}>
  //     ...
  //   </CraftEditor>

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopToolbar
        entityName={entityName}
        backHref={backHref}
        onSave={handleSave}
        onPublish={handlePublish}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Canvas />
        <BottomBar />
      </div>
    </div>
  );
}
