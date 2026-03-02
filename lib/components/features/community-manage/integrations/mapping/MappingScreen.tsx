'use client';

import React from 'react';
import clsx from 'clsx';

import { Button, Segment } from '$lib/components/core';

import { ConflictPolicySelector } from './ConflictPolicySelector';
import { DryRunPreview } from './DryRunPreview';
import { ErrorPanel } from './ErrorPanel';
import { EventMappingEditor } from './EventMappingEditor';
import { CONNECTORS_MAPPING_UI_ENABLED } from './feature-flag';
import { SpaceMappingEditor } from './SpaceMappingEditor';
import { useMappingActions, useMappingConfig, useSaveLoading } from './store';

export function MappingScreen() {
  if (!CONNECTORS_MAPPING_UI_ENABLED) {
    return null;
  }

  return <MappingScreenContent />;
}

function MappingScreenContent() {
  const config = useMappingConfig();
  const saveLoading = useSaveLoading();
  const { switchScope, save } = useMappingActions();

  return (
    <div className="page mx-auto py-6 px-4 md:px-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Data Mapping</h2>
          <p className="text-sm text-tertiary mt-1">
            Configure how fields map between Lemonade and your external data source.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={save}
          disabled={saveLoading || config.fieldMappings.length === 0}
          iconLeft={saveLoading ? undefined : 'icon-done'}
        >
          {saveLoading ? 'Saving...' : 'Save Mapping'}
        </Button>
      </div>

      {/* Scope toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-tertiary font-medium">Scope:</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => switchScope('event')}
            className={clsx(
              'px-3 py-1.5 rounded-sm text-sm font-medium transition-colors',
              config.scope === 'event'
                ? 'bg-primary/12 text-primary'
                : 'text-tertiary hover:bg-primary/4',
            )}
          >
            Events
          </button>
          <button
            type="button"
            onClick={() => switchScope('space')}
            className={clsx(
              'px-3 py-1.5 rounded-sm text-sm font-medium transition-colors',
              config.scope === 'space'
                ? 'bg-primary/12 text-primary'
                : 'text-tertiary hover:bg-primary/4',
            )}
          >
            Members
          </button>
        </div>
      </div>

      {/* Mapping editor (scope-specific) */}
      {config.scope === 'event' ? <EventMappingEditor /> : <SpaceMappingEditor />}

      {/* Conflict policy + upsert keys */}
      <ConflictPolicySelector />

      {/* Dry run preview */}
      <DryRunPreview />

      {/* Error panel */}
      <ErrorPanel />
    </div>
  );
}
