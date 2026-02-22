'use client';

import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { pageConfigAtom, activeRightPanelAtom, devicePreviewAtom, isPublishingAtom } from '../store';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import type { RightPanelType, DevicePreview } from '../types';

// ---------------------------------------------------------------------------
// Quick Action Definitions
// ---------------------------------------------------------------------------

interface QuickAction {
  id: string;
  label: string;
  icon: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'add-section', label: 'Add Section', icon: 'icon-add-circle-outline' },
  { id: 'change-theme', label: 'Theme', icon: 'icon-palette-outline' },
  { id: 'edit-seo', label: 'SEO', icon: 'icon-globe' },
  { id: 'preview-mobile', label: 'Preview', icon: 'icon-smartphone' },
  { id: 'publish', label: 'Publish', icon: 'icon-rocket' },
];

// ---------------------------------------------------------------------------
// AIPageBuilderPanel
// ---------------------------------------------------------------------------

/**
 * AIPageBuilderPanel -- Quick action chips for AI chat integration.
 *
 * Renders a horizontal scrollable row of pill-shaped buttons that the user
 * can tap to perform common page builder operations from the AI chat area.
 * Place this inside the editor layout, below or overlaying the AI chat.
 *
 * Props:
 *  - onPublish: callback triggered when the user taps the "Publish" chip.
 *    The parent Editor component owns the actual publish logic.
 */
export function AIPageBuilderPanel({ onPublish }: { onPublish?: () => void }) {
  const config = useAtomValue(pageConfigAtom);
  const isPublishing = useAtomValue(isPublishingAtom);
  const setActivePanel = useSetAtom(activeRightPanelAtom);
  const setDevicePreview = useSetAtom(devicePreviewAtom);
  const devicePreview = useAtomValue(devicePreviewAtom);

  const handleAction = React.useCallback(
    (actionId: string) => {
      switch (actionId) {
        case 'add-section':
          setActivePanel('properties' as RightPanelType);
          break;
        case 'change-theme':
          setActivePanel('theme' as RightPanelType);
          break;
        case 'edit-seo':
          setActivePanel('seo' as RightPanelType);
          break;
        case 'preview-mobile':
          setDevicePreview((prev: DevicePreview) => (prev === 'mobile' ? 'desktop' : 'mobile'));
          break;
        case 'publish':
          onPublish?.();
          break;
      }
    },
    [setActivePanel, setDevicePreview, onPublish],
  );

  if (!config) return null;

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-3">
      {QUICK_ACTIONS.map((action) => {
        const isActive =
          (action.id === 'preview-mobile' && devicePreview === 'mobile') ||
          (action.id === 'publish' && isPublishing);

        return (
          <button
            key={action.id}
            className={twMerge(
              clsx(
                'flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5',
                'text-sm font-medium transition cursor-pointer',
                'bg-overlay-secondary hover:bg-primary/12',
                isActive ? 'text-primary bg-primary/12' : 'text-secondary',
              ),
            )}
            onClick={() => handleAction(action.id)}
            disabled={action.id === 'publish' && isPublishing}
          >
            <i className={clsx(action.icon, 'size-4')} />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// useAIPageBuilderSync
// ---------------------------------------------------------------------------

/**
 * useAIPageBuilderSync -- Hook to keep the AI chat informed about the
 * current page builder state (config ID, section count, theme type,
 * publish status) so the AI can give contextual suggestions.
 *
 * Call this once inside the editor layout, not inside every panel.
 */
export function useAIPageBuilderSync() {
  const config = useAtomValue(pageConfigAtom);
  const devicePreview = useAtomValue(devicePreviewAtom);
  const [, aiChatDispatch] = useAIChat();

  // Sync whenever meaningful page builder state changes
  React.useEffect(() => {
    if (!config) return;

    aiChatDispatch({
      type: AIChatActionKind.set_data_run,
      payload: {
        data: {
          page_builder_config_id: config._id,
          page_builder_section_count: config.sections.length,
          page_builder_theme_type: config.theme.type,
          page_builder_theme_mode: config.theme.mode,
          page_builder_status: config.status,
          page_builder_version: config.version,
          page_builder_device_preview: devicePreview,
          page_builder_has_custom_code: Boolean(
            config.custom_code?.css ||
              config.custom_code?.head_html ||
              config.custom_code?.body_html ||
              (config.custom_code?.scripts && config.custom_code.scripts.length > 0),
          ),
          page_builder_section_types: config.sections.map((s) => s.type),
        },
      },
    });
  }, [
    config?._id,
    config?.sections.length,
    config?.theme.type,
    config?.theme.mode,
    config?.status,
    config?.version,
    devicePreview,
    aiChatDispatch,
  ]);
}
