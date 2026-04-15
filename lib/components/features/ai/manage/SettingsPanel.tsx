import React from 'react';
import { useEditor, useNode, NodeProvider } from '@craftjs/core';
import { Button } from '$lib/components/core';
import { resolver } from './craft/resolver';
import { useStoreManageLayout } from './store';

export function SettingsPanel() {
  const state = useStoreManageLayout();
  const { selected, actions } = useEditor((state) => {
    const selectedNodeId = state.events.selected.size > 0 ? Array.from(state.events.selected)[0] : null;
    const node = selectedNodeId ? state.nodes[selectedNodeId] : null;
    return {
      selected: node
        ? {
            id: selectedNodeId,
            name: node.data.displayName || node.data.name,
            type: node.data.type,
            settings: node.related && node.related.settings,
          }
        : null,
    };
  });

  if (!selected || !selected.id) return null;

  // Find the component's craft settings via the resolver or node directly
  const ComponentClass = typeof selected.type === 'string' ? (resolver as any)[selected.type] : selected.type;
  const displayName = selected.name || ComponentClass?.craft?.displayName || 'Component';
  const SettingsComponent = selected.settings || ComponentClass?.craft?.related?.settings;

  return (
    <div key={selected.id} className="flex flex-col h-full w-full max-w-[448px] bg-overlay-primary overflow-hidden border border-card-border rounded-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-card-border shrink-0 gap-3">
        <p className="truncate flex-1 font-medium">{displayName}</p>
        <Button
          variant="tertiary-alt"
          size="sm"
          icon="icon-keyboard-double-arrow-left"
          onClick={() => actions.selectNode(undefined)}
          className="aspect-square"
        />
      </div>

      <div className="flex-1 overflow-auto p-5 custom-scrollbar">
        {SettingsComponent ? (
          <NodeProvider id={selected.id}>
            <SettingsComponent />
          </NodeProvider>
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

export const useSettings = () => {
  const { id, actions, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return { id, actions, props };
};
