'use client';
import React from 'react';
import { Button } from '$lib/components/core';
import { resolver } from './craft/resolver';
import { useStoreManageLayout } from './store';
import { usePageEditor, NodeIdContext } from '$lib/components/features/page-builder/context';

export { useSettings } from '$lib/components/features/page-builder/context';

export function SettingsPanel() {
  const state = useStoreManageLayout();
  const { selectedId, nodes, actions } = usePageEditor();

  if (!selectedId || !nodes[selectedId]) return null;

  const node = nodes[selectedId];
  const componentName = node.type.resolvedName;
  const ComponentClass = resolver[componentName as keyof typeof resolver];
  const displayName = node.displayName || (ComponentClass as any)?.craft?.displayName || componentName;
  const SettingsComponent = (ComponentClass as any)?.craft?.related?.settings;

  return (
    <div key={selectedId} className="flex flex-col h-full w-full max-w-[448px] bg-overlay-primary overflow-hidden border border-card-border rounded-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-card-border shrink-0 gap-3">
        <p className="truncate flex-1 font-medium">{displayName}</p>
        <Button
          variant="tertiary-alt"
          size="sm"
          icon="icon-keyboard-double-arrow-left"
          onClick={() => actions.selectNode(null)}
          className="aspect-square"
        />
      </div>

      <div className="flex-1 overflow-auto p-5 custom-scrollbar">
        {SettingsComponent ? (
          <NodeIdContext.Provider value={selectedId}>
            <SettingsComponent />
          </NodeIdContext.Provider>
        ) : (
          <div className="text-center py-10 text-tertiary">
            <p className="text-sm">No settings available for this component.</p>
          </div>
        )}
      </div>

      {state.builderTab === 'sections' && (
        <div className="p-4 border-t border-card-border bg-overlay-primary shrink-0 flex justify-start">
          <Button
            variant="secondary"
            className="rounded-sm bg-accent-500 hover:bg-accent-600 text-white font-bold h-11 px-10"
            onClick={() => window.dispatchEvent(new CustomEvent('craft-save'))}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
