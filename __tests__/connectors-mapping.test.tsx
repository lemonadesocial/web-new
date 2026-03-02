import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import React from 'react';
import { Provider } from 'jotai';

import {
  createDefaultMappingConfig,
  addFieldMapping,
  removeFieldMapping,
  updateConflictPolicy,
  updateUpsertKeys,
  getLemonadeFields,
  getExternalFields,
  saveMappingConfig,
  runDryRun,
} from '$lib/components/features/community-manage/integrations/mapping/mock-adapter';

import type { ConflictPolicy } from '$lib/components/features/community-manage/integrations/mapping/types';

// ---------------------------------------------------------------------------
// Mock adapter unit tests (no DOM needed)
// ---------------------------------------------------------------------------

describe('Mock Adapter', () => {
  describe('createDefaultMappingConfig', () => {
    it('creates an event config with defaults', () => {
      const config = createDefaultMappingConfig('event');
      expect(config.scope).toBe('event');
      expect(config.direction).toBe('import');
      expect(config.provider).toBe('google_sheets');
      expect(config.fieldMappings).toEqual([]);
      expect(config.conflictPolicy).toBe('skip');
      expect(config.upsertKeys).toEqual([]);
    });

    it('creates a space config', () => {
      const config = createDefaultMappingConfig('space', 'airtable', 'export');
      expect(config.scope).toBe('space');
      expect(config.provider).toBe('airtable');
      expect(config.direction).toBe('export');
    });
  });

  describe('addFieldMapping', () => {
    it('adds a mapping to the config', () => {
      const config = createDefaultMappingConfig('event');
      const updated = addFieldMapping(config, 'title', 'Event Name');
      expect(updated.fieldMappings).toHaveLength(1);
      expect(updated.fieldMappings[0].sourceField).toBe('title');
      expect(updated.fieldMappings[0].targetField).toBe('Event Name');
    });

    it('preserves existing mappings', () => {
      let config = createDefaultMappingConfig('event');
      config = addFieldMapping(config, 'title', 'Event Name');
      config = addFieldMapping(config, 'start', 'Date');
      expect(config.fieldMappings).toHaveLength(2);
    });
  });

  describe('removeFieldMapping', () => {
    it('removes a mapping by id', () => {
      let config = createDefaultMappingConfig('event');
      config = addFieldMapping(config, 'title', 'Event Name');
      const mappingId = config.fieldMappings[0].id;
      config = removeFieldMapping(config, mappingId);
      expect(config.fieldMappings).toHaveLength(0);
    });

    it('no-ops for non-existent id', () => {
      let config = createDefaultMappingConfig('event');
      config = addFieldMapping(config, 'title', 'Event Name');
      config = removeFieldMapping(config, 'non-existent');
      expect(config.fieldMappings).toHaveLength(1);
    });
  });

  describe('updateConflictPolicy', () => {
    it.each(['skip', 'overwrite', 'merge'] as ConflictPolicy[])('sets policy to %s', (policy) => {
      const config = createDefaultMappingConfig('event');
      const updated = updateConflictPolicy(config, policy);
      expect(updated.conflictPolicy).toBe(policy);
    });
  });

  describe('updateUpsertKeys', () => {
    it('sets upsert keys', () => {
      const config = createDefaultMappingConfig('event');
      const updated = updateUpsertKeys(config, ['title', 'start']);
      expect(updated.upsertKeys).toEqual(['title', 'start']);
    });
  });

  describe('getLemonadeFields / getExternalFields', () => {
    it('returns event fields for event scope', () => {
      const fields = getLemonadeFields('event');
      expect(fields.length).toBeGreaterThan(0);
      expect(fields.some((f) => f.key === 'title')).toBe(true);
    });

    it('returns space fields for space scope', () => {
      const fields = getLemonadeFields('space');
      expect(fields.length).toBeGreaterThan(0);
      expect(fields.some((f) => f.key === 'email')).toBe(true);
    });

    it('returns external event fields', () => {
      const fields = getExternalFields('event');
      expect(fields.length).toBeGreaterThan(0);
      expect(fields.some((f) => f.key === 'Event Name')).toBe(true);
    });

    it('returns external space fields', () => {
      const fields = getExternalFields('space');
      expect(fields.length).toBeGreaterThan(0);
      expect(fields.some((f) => f.key === 'Email Address')).toBe(true);
    });
  });

  describe('saveMappingConfig', () => {
    it('returns config with updated timestamp', async () => {
      const config = createDefaultMappingConfig('event');
      const saved = await saveMappingConfig(config);
      expect(saved.id).toBe(config.id);
      expect(new Date(saved.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(config.updatedAt).getTime());
    });
  });

  describe('runDryRun', () => {
    it('returns results with expected shape', async () => {
      let config = createDefaultMappingConfig('event');
      config = addFieldMapping(config, 'title', 'Event Name');
      const result = await runDryRun(config);
      expect(result.totalRows).toBe(12);
      expect(result.successCount + result.warningCount + result.errorCount).toBe(result.totalRows);
      expect(result.rows).toHaveLength(12);
    });

    it('includes error and warning rows', async () => {
      let config = createDefaultMappingConfig('event');
      config = addFieldMapping(config, 'title', 'Event Name');
      const result = await runDryRun(config);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.warningCount).toBeGreaterThan(0);
      const errorRow = result.rows.find((r) => r.status === 'error');
      expect(errorRow?.message).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// Component render tests
// ---------------------------------------------------------------------------

// Mock the feature flag module to enable the UI
vi.mock('$lib/components/features/community-manage/integrations/mapping/feature-flag', () => ({
  CONNECTORS_MAPPING_UI_ENABLED: true,
}));

// We need to dynamically import after mock is set up
describe('MappingScreen Component', () => {
  let MappingScreen: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('$lib/components/features/community-manage/integrations/mapping/MappingScreen');
    MappingScreen = mod.MappingScreen;
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the mapping screen with header and save button', () => {
    const { container } = render(
      <Provider>
        <MappingScreen />
      </Provider>,
    );
    expect(container.querySelector('h2')?.textContent).toBe('Data Mapping');
    expect(screen.getByRole('button', { name: /Save Mapping/i })).toBeDefined();
  });

  it('renders scope toggle with Events and Members buttons', () => {
    render(
      <Provider>
        <MappingScreen />
      </Provider>,
    );
    const buttons = screen.getAllByRole('button');
    const eventsBtn = buttons.find((b) => b.textContent === 'Events');
    const membersBtn = buttons.find((b) => b.textContent === 'Members');
    expect(eventsBtn).toBeDefined();
    expect(membersBtn).toBeDefined();
  });

  it('renders event mapping editor by default', () => {
    const { container } = render(
      <Provider>
        <MappingScreen />
      </Provider>,
    );
    const headings = container.querySelectorAll('h3');
    const eventHeading = Array.from(headings).find((h) => h.textContent === 'Event Field Mapping');
    expect(eventHeading).toBeDefined();
  });

  it('switches to space mapping editor on Members click', async () => {
    const { container } = render(
      <Provider>
        <MappingScreen />
      </Provider>,
    );

    const buttons = screen.getAllByRole('button');
    const membersBtn = buttons.find((b) => b.textContent === 'Members');
    expect(membersBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(membersBtn!);
    });

    const headings = container.querySelectorAll('h3');
    const spaceHeading = Array.from(headings).find((h) => h.textContent === 'Member / Subscriber Field Mapping');
    expect(spaceHeading).toBeDefined();
  });

  it('renders conflict policy options (Skip, Overwrite, Merge)', () => {
    render(
      <Provider>
        <MappingScreen />
      </Provider>,
    );
    const buttons = screen.getAllByRole('button');
    const policyNames = ['Skip', 'Overwrite', 'Merge'];
    for (const name of policyNames) {
      expect(buttons.some((b) => b.textContent === name)).toBe(true);
    }
  });

  it('renders dry run preview section', () => {
    const { container } = render(
      <Provider>
        <MappingScreen />
      </Provider>,
    );
    const headings = container.querySelectorAll('h3');
    const dryRunHeading = Array.from(headings).find((h) => h.textContent === 'Dry Run Preview');
    expect(dryRunHeading).toBeDefined();
  });

  it('shows empty state when no mappings exist', () => {
    const { container } = render(
      <Provider>
        <MappingScreen />
      </Provider>,
    );
    expect(container.textContent).toContain('No field mappings configured');
  });
});
