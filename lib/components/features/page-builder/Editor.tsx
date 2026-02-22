'use client';

import React from 'react';
import { Editor as CraftEditor, useEditor } from '@craftjs/core';
import { useSetAtom, useAtomValue } from 'jotai';
import debounce from 'lodash/debounce';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { toast, drawer } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request/hooks';

import { sectionResolver } from './sections/resolver';
import { setEditorConnectors } from './utils/use-safe-editor';
import {
  pageConfigToCraftState,
  craftStateToPageConfig,
} from './serializer';
import type { SerializedNodes } from './serializer';
import {
  configIdAtom,
  ownerTypeAtom,
  ownerIdAtom,
  isDirtyAtom,
  isSavingAtom,
  isPublishingAtom,
  isLockedAtom,
  pageConfigAtom,
  canUndoAtom,
  canRedoAtom,
  selectedNodeIdAtom,
  activeRightPanelAtom,
} from './store';
import type { OwnerType, PageConfig } from './types';
import { TopToolbar } from './TopToolbar';
import { Canvas } from './Canvas';
import { BottomBar } from './BottomBar';
import { PropsPanel } from './PropsPanel';
import {
  ACQUIRE_CONFIG_LOCK,
  HEARTBEAT_CONFIG_LOCK,
  RELEASE_CONFIG_LOCK,
  UPDATE_PAGE_CONFIG,
  PUBLISH_PAGE_CONFIG,
} from './queries';

// ── Constants ──

const LOCK_HEARTBEAT_INTERVAL_MS = 60_000; // 60 seconds

// Cast helper — raw gql templates are DocumentNode, not TypedDocumentNode.
// This cast is safe at runtime; full type safety comes after codegen (Priority 4).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDocument = TypedDocumentNode<any, any>;

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
 * Wraps the entire editor in Craft.js `<Editor>` to provide visual editing,
 * drag-and-drop, and undo/redo. Handles lock lifecycle and atom hydration
 * at this level (outside Craft.js context), then delegates save/publish
 * and Craft.js state sync to `EditorInner`.
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
  const setIsLocked = useSetAtom(isLockedAtom);

  // ── Hydrate Jotai atoms on mount ──
  React.useEffect(() => {
    setConfigId(config._id);
    setOwnerType(ownerType);
    setOwnerId(ownerId);
    setPageConfig(config);
    setIsDirty(false);
  }, [config, ownerType, ownerId, setConfigId, setOwnerType, setOwnerId, setPageConfig, setIsDirty]);

  // ── Lock lifecycle ──
  const [acquireLock] = useMutation(ACQUIRE_CONFIG_LOCK as AnyDocument);
  const [heartbeatLock] = useMutation(HEARTBEAT_CONFIG_LOCK as AnyDocument);
  const [releaseLock] = useMutation(RELEASE_CONFIG_LOCK as AnyDocument);

  const acquireLockRef = React.useRef(acquireLock);
  acquireLockRef.current = acquireLock;
  const heartbeatLockRef = React.useRef(heartbeatLock);
  heartbeatLockRef.current = heartbeatLock;
  const releaseLockRef = React.useRef(releaseLock);
  releaseLockRef.current = releaseLock;

  React.useEffect(() => {
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    const doAcquire = async () => {
      try {
        const { data } = await acquireLockRef.current({
          variables: { configId: config._id },
        });
        if (data?.acquireConfigLock?.success) {
          setIsLocked(true);
        } else {
          toast.error(
            data?.acquireConfigLock?.message ??
              'Could not acquire editor lock.',
          );
        }
      } catch {
        toast.error(
          'Could not acquire editor lock. Another user may be editing.',
        );
      }
    };

    const doHeartbeat = async () => {
      try {
        await heartbeatLockRef.current({ variables: { configId: config._id } });
      } catch {
        setIsLocked(false);
        toast.error('Editor lock lost. Your changes may not save.');
      }
    };

    const doRelease = async () => {
      try {
        await releaseLockRef.current({ variables: { configId: config._id } });
        setIsLocked(false);
      } catch {
        // Best effort — ignore on unmount
      }
    };

    doAcquire();
    heartbeatTimer = setInterval(doHeartbeat, LOCK_HEARTBEAT_INTERVAL_MS);

    // Note: async operations in beforeunload are unreliable.
    // The lock will auto-expire via server-side timeout.
    // sendBeacon would be ideal but requires a dedicated REST endpoint.
    const handleBeforeUnload = () => {
      doRelease();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      doRelease();
    };
  }, [config._id, setIsLocked]);

  // ── Compute initial Craft.js state from PageConfig ──
  const initialCraftState = React.useMemo(
    () => JSON.stringify(pageConfigToCraftState(config)),
    [config],
  );

  // ── Render ──
  return (
    <CraftEditor resolver={sectionResolver} enabled>
      <EditorInner
        config={config}
        entityName={entityName}
        backHref={backHref}
        initialCraftState={initialCraftState}
      />
    </CraftEditor>
  );
}

// ---------------------------------------------------------------------------
// EditorInner — lives inside <CraftEditor> so it can call useEditor()
// ---------------------------------------------------------------------------

function EditorInner({
  config,
  entityName,
  backHref,
  initialCraftState,
}: {
  config: PageConfig;
  entityName: string;
  backHref: string;
  initialCraftState: string;
}) {
  const { query } = useEditor();
  const setIsDirty = useSetAtom(isDirtyAtom);
  const setIsSaving = useSetAtom(isSavingAtom);
  const setIsPublishing = useSetAtom(isPublishingAtom);
  const isDirty = useAtomValue(isDirtyAtom);
  const pageConfig = useAtomValue(pageConfigAtom);

  // Mutations
  const [updateConfig] = useMutation(UPDATE_PAGE_CONFIG as AnyDocument);
  const [publishConfig] = useMutation(PUBLISH_PAGE_CONFIG as AnyDocument);

  // ── Extract current Craft.js state as PageConfig ──
  const extractPageConfig = React.useCallback((): PageConfig | null => {
    if (!pageConfig) return null;
    try {
      const json = query.serialize();
      const craftNodes = JSON.parse(json) as SerializedNodes;
      return craftStateToPageConfig(craftNodes, pageConfig);
    } catch {
      return pageConfig;
    }
  }, [query, pageConfig]);

  /** Build the GraphQL update input from a PageConfig */
  const buildUpdateInput = (cfg: PageConfig) => ({
    sections: cfg.sections,
    theme: cfg.theme,
    custom_code: cfg.custom_code,
    seo: cfg.seo,
  });

  // ── Auto-save (2 s debounce) ──
  const extractPageConfigRef = React.useRef(extractPageConfig);
  extractPageConfigRef.current = extractPageConfig;

  const debouncedSave = React.useMemo(
    () =>
      debounce(async () => {
        const currentConfig = extractPageConfigRef.current();
        if (!currentConfig) return;
        try {
          setIsSaving(true);
          await updateConfig({
            variables: {
              id: currentConfig._id,
              input: buildUpdateInput(currentConfig),
            },
          });
          setIsDirty(false);
        } catch {
          toast.error('Auto-save failed. Your work is still in memory.');
        } finally {
          setIsSaving(false);
        }
      }, 2_000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    if (isDirty) debouncedSave();
    return () => debouncedSave.cancel();
  }, [isDirty, debouncedSave]);

  // ── Manual save ──
  const handleSave = async () => {
    const currentConfig = extractPageConfig();
    if (!currentConfig) return;
    try {
      setIsSaving(true);
      debouncedSave.cancel();
      await updateConfig({
        variables: {
          id: currentConfig._id,
          input: buildUpdateInput(currentConfig),
        },
      });
      setIsDirty(false);
      toast.success('Draft saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Publish ──
  const handlePublish = async () => {
    const currentConfig = extractPageConfig();
    if (!currentConfig) return;
    try {
      setIsPublishing(true);
      debouncedSave.cancel();
      // Save first, then publish
      await updateConfig({
        variables: {
          id: currentConfig._id,
          input: buildUpdateInput(currentConfig),
        },
      });
      await publishConfig({ variables: { id: currentConfig._id } });
      setIsDirty(false);
      toast.success('Page published successfully!');
    } catch {
      toast.error('Publish failed');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <CraftStateWatcher />
      <TopToolbar
        entityName={entityName}
        backHref={backHref}
        onSave={handleSave}
        onPublish={handlePublish}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Canvas initialData={initialCraftState} />
        <BottomBar />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CraftStateWatcher — syncs Craft.js editor state → Jotai atoms
// ---------------------------------------------------------------------------

function CraftStateWatcher() {
  const setCanUndo = useSetAtom(canUndoAtom);
  const setCanRedo = useSetAtom(canRedoAtom);
  const setSelectedNodeId = useSetAtom(selectedNodeIdAtom);
  const setActivePanel = useSetAtom(activeRightPanelAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);
  const isInitialized = React.useRef(false);

  // Split selectors to avoid cross-concern re-render cascades
  const { canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const { selectedId } = useEditor((state) => {
    const selected = state.events.selected;
    return {
      selectedId: selected.size > 0 ? selected.values().next().value : null,
    };
  });

  const { nodeCount } = useEditor((state) => ({
    nodeCount: Object.keys(state.nodes).length,
  }));

  const { connectors } = useEditor();

  // Register connectors for use by components outside the Editor context (e.g., drawers)
  React.useEffect(() => {
    setEditorConnectors(connectors);
    return () => setEditorConnectors(null);
  }, [connectors]);

  // Sync undo/redo to atoms
  React.useEffect(() => {
    setCanUndo(canUndo);
  }, [canUndo, setCanUndo]);

  React.useEffect(() => {
    setCanRedo(canRedo);
  }, [canRedo, setCanRedo]);

  // Sync selection + auto-open PropsPanel drawer
  React.useEffect(() => {
    setSelectedNodeId(selectedId ?? null);
    if (selectedId) {
      setActivePanel('properties');
      drawer.open(PropsPanel, {
        position: 'right',
        dismissible: true,
        showBackdrop: false,
        fixed: false,
      });
    }
  }, [selectedId, setSelectedNodeId, setActivePanel]);

  // Mark dirty when nodes are added/removed
  const prevNodeCount = React.useRef(nodeCount);
  React.useEffect(() => {
    if (isInitialized.current && nodeCount !== prevNodeCount.current) {
      setIsDirty(true);
    }
    prevNodeCount.current = nodeCount;
    isInitialized.current = true;
  }, [nodeCount, setIsDirty]);

  return null;
}
