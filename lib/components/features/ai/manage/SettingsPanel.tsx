'use client';
import React from 'react';
import { useEditor } from '@craftjs/core';
import { Button } from '$lib/components/core';
import { resolver } from './craft/resolver';

export function SettingsPanel() {
  const { selected, actions } = useEditor((state) => {
    const selectedNodeId = state.events.selected.size > 0 ? Array.from(state.events.selected)[0] : null;
    return {
      selected: selectedNodeId
        ? {
            id: selectedNodeId,
            type: state.nodes[selectedNodeId].data.type,
            name: state.nodes[selectedNodeId].data.displayName,
            settings: state.nodes[selectedNodeId].related && state.nodes[selectedNodeId].related.settings,
          }
        : null,
    };
  });

  if (!selected) return null;

  // Find the component's craft settings via the resolver
  const ComponentClass = (resolver as any)[selected.type as any];
  const displayName = ComponentClass?.craft?.displayName || selected.name;
  const SettingsComponent = ComponentClass?.craft?.related?.settings;

  return (
    <div className="flex flex-col h-full w-full max-w-[448px] bg-overlay-primary overflow-hidden border border-card-border rounded-sm">
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
        {selected.settings ? (
          React.createElement(selected.settings)
        ) : (
          <div className="text-center py-10 text-tertiary">
            <p className="text-sm">No settings available for this component.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-card-border bg-overlay-primary shrink-0">
        <Button
          variant="secondary"
          className="flex-1 rounded-sm bg-accent-500 hover:bg-accent-600 text-white font-bold h-11"
          onClick={() => window.dispatchEvent(new CustomEvent('craft-save'))}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// Helper hook for settings components
import { useNode } from '@craftjs/core';
export const useSettings = () => {
  const { id, actions, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return { id, actions, props };
};
