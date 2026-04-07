'use client';
import React from 'react';
import { useEditor } from '@craftjs/core';
import { Button } from '$lib/components/core';

export function SettingsPanel() {
  const { selected, actions } = useEditor((state) => {
    const selectedNodeId = state.events.selected.size > 0 ? Array.from(state.events.selected)[0] : null;
    return {
      selected: selectedNodeId
        ? {
            id: selectedNodeId,
            name: state.nodes[selectedNodeId].data.displayName,
            settings: state.nodes[selectedNodeId].related && state.nodes[selectedNodeId].related.settings,
          }
        : null,
    };
  });

  if (!selected) return null;

  return (
    <div className="flex flex-col h-full bg-overlay-primary overflow-hidden">
      <div className="flex items-center justify-between px-4 h-12 border-b border-card-border shrink-0">
        <h2 className="text-lg font-semibold truncate flex-1">{selected.name}</h2>
        <Button 
          variant="tertiary-alt" 
          size="sm" 
          icon="icon-arrow-back-sharp" 
          onClick={() => actions.selectNode(null)} 
          className="shrink-0 aspect-square rounded-sm p-0 flex items-center justify-center bg-(--btn-tertiary)!"
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
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-1 bg-error/16 text-error rounded-full text-xs font-bold shrink-0">
              <span className="size-4 bg-error text-white rounded-full flex items-center justify-center text-[10px]">N</span>
              2 Issues
              <i className="icon-close size-3" />
           </div>
           <Button variant="secondary" className="flex-1 rounded-sm bg-accent-500 hover:bg-accent-600 text-white font-bold h-11" onClick={() => window.dispatchEvent(new CustomEvent('craft-save'))}>
             Save Changes
           </Button>
        </div>
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
