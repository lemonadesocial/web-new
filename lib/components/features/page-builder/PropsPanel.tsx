'use client';

import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import clsx from 'clsx';

import { Button } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { Pane } from '$lib/components/core/pane/pane';
import { drawer } from '$lib/components/core/dialog';

import { selectedNodeIdAtom, pageConfigAtom, isDirtyAtom } from './store';
import { getSectionLabel, PASCAL_TO_SECTION_TYPE } from './sections/resolver';
import { getEditorActions, getNodeInfo } from './utils/use-safe-editor';
import { SectionPropsEditor } from './props-editors/SectionPropsEditor';
import type {
  SectionAlignment,
  SectionLayout,
  SectionPadding,
  SectionType,
  SectionWidth,
} from './types';

// --- Tabs ---

type PropsPanelTab = 'properties' | 'layout' | 'data';

const TABS: { value: PropsPanelTab; label: string }[] = [
  { value: 'properties', label: 'Properties' },
  { value: 'layout', label: 'Layout' },
  { value: 'data', label: 'Data Source' },
];

/**
 * PropsPanel — rendered inside a right drawer when a section node is
 * selected on the canvas.
 *
 * Uses the editor bridge (use-safe-editor) instead of useEditor()
 * since the drawer renders outside the Craft.js <Editor> context.
 *
 * Three tabs:
 *  - Properties: section-specific fields driven by field-registry
 *  - Layout: width, padding, columns, alignment, background
 *  - Data Source: auto/manual toggle and field mapping
 */
export function PropsPanel() {
  const [selectedNodeId, setSelectedNodeId] = useAtom(selectedNodeIdAtom);
  const config = useAtomValue(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);
  const [activeTab, setActiveTab] = React.useState<PropsPanelTab>('properties');

  // Read node info from the bridge
  const nodeInfo = selectedNodeId ? getNodeInfo(selectedNodeId) : null;

  // Resolve section type from Craft.js node displayName
  const sectionType: SectionType | null = nodeInfo?.displayName
    ? PASCAL_TO_SECTION_TYPE[nodeInfo.displayName] ?? null
    : null;

  // Find the section data from the config (for layout tab)
  const section = config?.sections?.find((s) => s.id === selectedNodeId || s.craft_node_id === selectedNodeId);
  const sectionLabel = sectionType ? getSectionLabel(sectionType) : 'Section';

  /** Push a prop update to Craft.js via bridge and mark editor dirty */
  const handleUpdateProp = React.useCallback(
    (key: string, value: unknown) => {
      const actions = getEditorActions();
      if (selectedNodeId && actions) {
        actions.setProp(selectedNodeId, (props: Record<string, unknown>) => {
          props[key] = value;
        });
        setIsDirty(true);
      }
    },
    [selectedNodeId, setIsDirty],
  );

  const handleClose = () => {
    drawer.close();
    setSelectedNodeId(null);
  };

  return (
    <Pane.Root className="rounded-none">
      <Pane.Header.Root>
        <Pane.Header.Left showBackButton={false}>
          <span className="text-sm font-semibold text-primary">{sectionLabel}</span>
        </Pane.Header.Left>
        <Pane.Header.Right>
          <Button icon="icon-x" variant="flat" size="xs" onClick={handleClose} />
        </Pane.Header.Right>
      </Pane.Header.Root>

      {/* Tabs */}
      <div className="flex border-b px-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={clsx(
              'px-3 py-2 text-sm font-medium transition cursor-pointer',
              activeTab === tab.value
                ? 'text-primary border-b-2 border-primary'
                : 'text-tertiary hover:text-secondary',
            )}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Pane.Content className="p-4 overflow-auto">
        {activeTab === 'properties' && (
          <PropertiesTab
            key={selectedNodeId || 'none'}
            sectionType={sectionType}
            nodeProps={nodeInfo?.props ?? {}}
            onUpdateProp={handleUpdateProp}
          />
        )}
        {activeTab === 'layout' && (
          <LayoutTab
            key={selectedNodeId || 'none'}
            layout={section?.layout}
            onUpdateProp={handleUpdateProp}
          />
        )}
        {activeTab === 'data' && <DataSourceTab />}
      </Pane.Content>
    </Pane.Root>
  );
}

// --- Properties Tab ---

function PropertiesTab({
  sectionType,
  nodeProps,
  onUpdateProp,
}: {
  sectionType: SectionType | null;
  nodeProps: Record<string, unknown>;
  onUpdateProp: (key: string, value: unknown) => void;
}) {
  if (!sectionType) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-tertiary">Select a section on the canvas to edit its properties.</p>
      </div>
    );
  }

  return (
    <SectionPropsEditor
      sectionType={sectionType}
      props={nodeProps}
      onUpdateProp={onUpdateProp}
    />
  );
}

// --- Layout Tab ---

const WIDTH_OPTIONS: { value: SectionWidth; label: string }[] = [
  { value: 'full', label: 'Full Width' },
  { value: 'contained', label: 'Contained' },
  { value: 'narrow', label: 'Narrow' },
];

const PADDING_OPTIONS: { value: SectionPadding; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const ALIGNMENT_OPTIONS: { value: SectionAlignment; icon: string; label: string }[] = [
  { value: 'left', icon: 'icon-format-align-left', label: 'Left' },
  { value: 'center', icon: 'icon-format-align-center', label: 'Center' },
  { value: 'right', icon: 'icon-format-align-right', label: 'Right' },
];

function LayoutTab({
  layout,
  onUpdateProp,
}: {
  layout?: SectionLayout;
  onUpdateProp: (key: string, value: unknown) => void;
}) {
  const [width, setWidth] = React.useState<SectionWidth>(layout?.width ?? 'contained');
  const [padding, setPadding] = React.useState<SectionPadding>(layout?.padding ?? 'md');
  const [alignment, setAlignment] = React.useState<SectionAlignment>(layout?.alignment ?? 'center');
  const [columns, setColumns] = React.useState(layout?.columns ?? 1);

  return (
    <div className="space-y-5">
      {/* Width */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-secondary">Width</label>
        <div className="flex gap-1">
          {WIDTH_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={clsx(
                'flex-1 px-2 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
                width === opt.value
                  ? 'bg-primary/12 text-primary'
                  : 'text-tertiary hover:bg-primary/4',
              )}
              onClick={() => { setWidth(opt.value); onUpdateProp('width', opt.value); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Padding */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-secondary">Padding</label>
        <div className="flex gap-1">
          {PADDING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={clsx(
                'flex-1 px-1.5 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
                padding === opt.value
                  ? 'bg-primary/12 text-primary'
                  : 'text-tertiary hover:bg-primary/4',
              )}
              onClick={() => { setPadding(opt.value); onUpdateProp('padding', opt.value); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-secondary">Columns</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className={clsx(
                'flex-1 px-2 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
                columns === n
                  ? 'bg-primary/12 text-primary'
                  : 'text-tertiary hover:bg-primary/4',
              )}
              onClick={() => { setColumns(n as 1 | 2 | 3 | 4); onUpdateProp('columns', n); }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-secondary">Alignment</label>
        <div className="flex gap-1">
          {ALIGNMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={clsx(
                'flex items-center justify-center p-2 rounded-sm transition cursor-pointer',
                alignment === opt.value
                  ? 'bg-primary/12 text-primary'
                  : 'text-tertiary hover:bg-primary/4',
              )}
              onClick={() => { setAlignment(opt.value); onUpdateProp('alignment', opt.value); }}
              title={opt.label}
            >
              <i className={clsx(opt.icon, 'size-4')} />
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-secondary">Background Color</label>
        <InputField
          placeholder="e.g. #1a1a1a or transparent"
          value={layout?.background?.value ?? ''}
          onChangeText={(text) => {
            onUpdateProp('background', { type: 'color', value: text });
          }}
        />
      </div>

      {/* Min Height */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-secondary">Min Height</label>
        <InputField
          placeholder="e.g. 400px or auto"
          value={layout?.min_height ?? ''}
          onChangeText={(text) => {
            onUpdateProp('min_height', text);
          }}
        />
      </div>
    </div>
  );
}

// --- Data Source Tab ---

function DataSourceTab() {
  const [mode, setMode] = React.useState<'auto' | 'manual'>('auto');

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-secondary">Binding Mode</label>
        <div className="flex gap-1">
          <button
            className={clsx(
              'flex-1 px-3 py-2 rounded-sm text-sm font-medium transition cursor-pointer',
              mode === 'auto' ? 'bg-primary/12 text-primary' : 'text-tertiary hover:bg-primary/4',
            )}
            onClick={() => setMode('auto')}
          >
            Auto
          </button>
          <button
            className={clsx(
              'flex-1 px-3 py-2 rounded-sm text-sm font-medium transition cursor-pointer',
              mode === 'manual' ? 'bg-primary/12 text-primary' : 'text-tertiary hover:bg-primary/4',
            )}
            onClick={() => setMode('manual')}
          >
            Manual
          </button>
        </div>
      </div>

      {mode === 'auto' ? (
        <div className="rounded-sm border border-card-border bg-primary/4 p-4">
          <div className="flex items-center gap-2">
            <i className="icon-flash size-4 text-warning-400" />
            <p className="text-sm text-secondary">
              Data is automatically pulled from the linked event or space.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-tertiary">
            Field mapping will appear here once manual mode data sources are configured.
          </p>
          <div className="rounded-sm border border-dashed border-card-border p-6 flex flex-col items-center gap-2">
            <i className="icon-database size-6 text-tertiary" />
            <p className="text-xs text-tertiary">No manual fields configured</p>
          </div>
        </div>
      )}
    </div>
  );
}
