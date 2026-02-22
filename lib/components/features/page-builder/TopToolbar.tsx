'use client';

import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { Button, drawer, toast } from '$lib/components/core';
import {
  activeRightPanelAtom,
  canRedoAtom,
  canUndoAtom,
  isDirtyAtom,
  isPublishingAtom,
  isSavingAtom,
  ownerTypeAtom,
  pageConfigAtom,
} from './store';
import type { RightPanelType } from './types';
import { SectionCatalog } from './SectionCatalog';
import { PropsPanel } from './PropsPanel';
import { TemplatePanel } from './panels/TemplatePanel';
import { AssetPanel } from './panels/AssetPanel';
import { SEOPanel } from './panels/SEOPanel';
import { ThemePanel } from './panels/ThemePanel';
import { PreviewSharePanel } from './panels/PreviewSharePanel';
import { CodePanel } from './panels/CodePanel';
import { VersionHistoryPanel } from './panels/VersionHistoryPanel';

// --- Panel registry ---

const PANEL_COMPONENTS: Record<RightPanelType, React.ComponentType> = {
  properties: PropsPanel,
  theme: ThemePanel,
  seo: SEOPanel,
  assets: AssetPanel,
  templates: TemplatePanel,
  versions: VersionHistoryPanel,
  'preview-share': PreviewSharePanel,
  code: CodePanel,
};

// --- Toolbar icon definitions ---

interface ToolbarAction {
  id: RightPanelType;
  icon: string;
  label: string;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { id: 'properties', icon: 'icon-grid-view', label: 'Sections' },
  { id: 'theme', icon: 'icon-palette-outline', label: 'Theme' },
  { id: 'seo', icon: 'icon-globe', label: 'SEO' },
  { id: 'assets', icon: 'icon-image', label: 'Assets' },
  { id: 'templates', icon: 'icon-layers-outline', label: 'Templates' },
  { id: 'versions', icon: 'icon-clock', label: 'History' },
  { id: 'preview-share', icon: 'icon-share', label: 'Share' },
  { id: 'code', icon: 'icon-code', label: 'Code' },
];

// --- Props ---

interface TopToolbarProps {
  /** Display name for the entity being edited (event title or space title) */
  entityName: string;
  /** The back-navigation path (e.g. `/agent/e/manage/{shortid}`) */
  backHref: string;
  /** Called when Save Draft is clicked */
  onSave?: () => void;
  /** Called when Publish is clicked */
  onPublish?: () => void;
}

/**
 * TopToolbar — sticky top bar of the page builder.
 *
 * Left cluster:  back button + entity name
 * Center cluster: undo/redo + panel-opening icon buttons
 * Right cluster:  Save Draft + Publish
 */
export function TopToolbar({ entityName, backHref, onSave, onPublish }: TopToolbarProps) {
  const router = useRouter();

  const [activePanel, setActivePanel] = useAtom(activeRightPanelAtom);
  const isDirty = useAtomValue(isDirtyAtom);
  const isSaving = useAtomValue(isSavingAtom);
  const isPublishing = useAtomValue(isPublishingAtom);
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);
  const config = useAtomValue(pageConfigAtom);

  const isPublished = config?.status === 'published';

  // --- Panel toggle ---

  const openPanel = (panel: RightPanelType) => {
    // The "Sections" toolbar icon opens the SectionCatalog in the drawer
    // rather than the PropsPanel (which opens when clicking a node in-canvas).
    const Component =
      panel === 'properties' ? SectionCatalog : PANEL_COMPONENTS[panel];

    if (activePanel === panel) {
      // Toggle off — close drawer
      drawer.close();
      setActivePanel(null);
      return;
    }

    // Close any open drawer first, then open the new one
    drawer.close();
    setActivePanel(panel);
    drawer.open(Component, {
      position: 'right',
      dismissible: true,
      showBackdrop: false,
      fixed: false,
    });
  };

  // --- Undo / Redo (placeholder until Craft.js useEditor is wired) ---

  const handleUndo = () => {
    // Will call craft editor.actions.history.undo() once integrated
  };

  const handleRedo = () => {
    // Will call craft editor.actions.history.redo() once integrated
  };

  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 px-3 py-2 border-b bg-overlay-primary/80 backdrop-blur-md">
      {/* ---- Left cluster ---- */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          icon="icon-chevron-left"
          variant="flat"
          size="xs"
          onClick={() => router.push(backHref)}
          title="Back"
        />
        <span className="text-sm font-semibold text-primary truncate max-w-[180px]">
          {entityName}
        </span>
      </div>

      {/* ---- Separator ---- */}
      <div className="w-px h-5 bg-primary/12 mx-1 shrink-0" />

      {/* ---- Undo / Redo ---- */}
      <div className="flex items-center gap-0.5">
        <Button
          icon="icon-undo"
          variant="flat"
          size="xs"
          disabled={!canUndo}
          onClick={handleUndo}
          title="Undo"
        />
        <Button
          icon="icon-redo"
          variant="flat"
          size="xs"
          disabled={!canRedo}
          onClick={handleRedo}
          title="Redo"
        />
      </div>

      {/* ---- Separator ---- */}
      <div className="w-px h-5 bg-primary/12 mx-1 shrink-0" />

      {/* ---- Center panel actions ---- */}
      <div className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.id}
            className={clsx(
              'flex items-center gap-1.5 px-2 py-1.5 rounded-sm text-xs font-medium transition whitespace-nowrap cursor-pointer',
              activePanel === action.id
                ? 'bg-primary/12 text-primary'
                : 'text-tertiary hover:text-secondary hover:bg-primary/4',
            )}
            onClick={() => openPanel(action.id)}
            title={action.label}
          >
            <i className={clsx(action.icon, 'size-4')} />
            <span className="hidden lg:inline">{action.label}</span>
          </button>
        ))}
      </div>

      {/* ---- Separator ---- */}
      <div className="w-px h-5 bg-primary/12 mx-1 shrink-0" />

      {/* ---- Right cluster ---- */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="tertiary-alt"
          size="sm"
          onClick={onSave}
          loading={isSaving}
          disabled={!isDirty && !isSaving}
        >
          Save Draft
        </Button>
        {isPublished ? (
          <Button
            variant="primary"
            size="sm"
            onClick={onPublish}
            loading={isPublishing}
          >
            Update
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={onPublish}
            loading={isPublishing}
          >
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}
