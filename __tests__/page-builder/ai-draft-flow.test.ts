import { expect, it, describe } from 'vitest';
import { createStore } from 'jotai';
import type { PageConfig } from '$lib/components/features/page-builder/types';
import { DEFAULT_THEME } from '$lib/components/features/page-builder/types';
import {
  aiDraftPhaseAtom,
  aiPreSnapshotAtom,
  aiPrePageConfigAtom,
  aiDraftConfigAtom,
  isAIDraftPreviewAtom,
} from '$lib/components/features/page-builder/store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MOCK_CONFIG: PageConfig = {
  _id: 'cfg-1',
  owner_type: 'event',
  owner_id: 'event-1',
  created_by: 'user-1',
  status: 'draft',
  version: 1,
  theme: DEFAULT_THEME,
  sections: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const MOCK_CRAFT_SNAPSHOT = JSON.stringify({ ROOT: { type: 'div', props: {} } });

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AI Draft Flow — Jotai Atoms', () => {
  it('aiDraftPhaseAtom defaults to idle', () => {
    const store = createStore();
    expect(store.get(aiDraftPhaseAtom)).toBe('idle');
  });

  it('isAIDraftPreviewAtom derives true when phase is previewing', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'previewing');
    expect(store.get(isAIDraftPreviewAtom)).toBe(true);
  });

  it('isAIDraftPreviewAtom derives false for idle, loading, error', () => {
    const store = createStore();

    store.set(aiDraftPhaseAtom, 'idle');
    expect(store.get(isAIDraftPreviewAtom)).toBe(false);

    store.set(aiDraftPhaseAtom, 'loading');
    expect(store.get(isAIDraftPreviewAtom)).toBe(false);

    store.set(aiDraftPhaseAtom, 'error');
    expect(store.get(isAIDraftPreviewAtom)).toBe(false);
  });

  it('aiPreSnapshotAtom stores and clears serialized Craft state', () => {
    const store = createStore();
    expect(store.get(aiPreSnapshotAtom)).toBeNull();

    store.set(aiPreSnapshotAtom, MOCK_CRAFT_SNAPSHOT);
    expect(store.get(aiPreSnapshotAtom)).toBe(MOCK_CRAFT_SNAPSHOT);

    store.set(aiPreSnapshotAtom, null);
    expect(store.get(aiPreSnapshotAtom)).toBeNull();
  });

  it('aiDraftConfigAtom stores PageConfig from AI mutation', () => {
    const store = createStore();
    expect(store.get(aiPrePageConfigAtom)).toBeNull();

    store.set(aiPrePageConfigAtom, MOCK_CONFIG);
    expect(store.get(aiPrePageConfigAtom)).toEqual(MOCK_CONFIG);

    const aiResult = { ...MOCK_CONFIG, _id: 'cfg-ai', version: 2, sections: [{ id: 's1', type: 'event_hero', order: 0 }] } as PageConfig;
    store.set(aiDraftConfigAtom, aiResult);
    expect(store.get(aiDraftConfigAtom)).toEqual(aiResult);
  });
});
