'use client';
import React from 'react';
import { Button } from '$lib/components/core';
import { useGridSelectedId, useGridState, gridLayoutActions } from './layoutStore';
import { resolver } from './craft/resolver';

export function SettingsPanel() {
  const selectedId = useGridSelectedId();
  const state = useGridState();
  const selected = selectedId ? state.components[selectedId] : null;

  if (!selectedId || !selected) return null;

  // Find the component's craft settings via the resolver
  const ComponentClass = (resolver as any)[selected.type];
  const SettingsComponent = ComponentClass?.craft?.related?.settings;

  return (
    <div className="flex flex-col h-full w-full max-w-[448px] bg-overlay-primary overflow-hidden border border-card-border rounded-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-card-border shrink-0 gap-3">
        <p className="truncate flex-1">{ComponentClass?.craft?.displayName || selected.type}</p>
        <Button
          variant="tertiary-alt"
          size="sm"
          icon="icon-keyboard-double-arrow-left"
          onClick={() => gridLayoutActions.selectNode(null)}
          className="aspect-square"
        />
      </div>

      <div className="flex-1 overflow-auto p-5 custom-scrollbar">
        {SettingsComponent ? (
          React.createElement(SettingsComponent)
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

// Helper hook for settings components to match the Craft.js API
export const useSettings = () => {
  const selectedId = useGridSelectedId();
  const state = useGridState();
  const props = selectedId ? state.components[selectedId]?.props : {};

  const actions = {
    setProp: (updater: (props: any) => void) => {
      if (!selectedId) return;
      // We pass a copy of the props to the updater to emulate Immer/Craft behavior
      const newProps = { ...props };
      updater(newProps);
      gridLayoutActions.updateProps(selectedId, newProps);
    }
  };

  return { id: selectedId, actions, props };
};
