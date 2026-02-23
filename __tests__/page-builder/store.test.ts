import { expect, it, describe } from 'vitest';
import { createStore } from 'jotai';
import type { PageConfig } from '$lib/components/features/page-builder/types';
import { DEFAULT_THEME } from '$lib/components/features/page-builder/types';
import {
  configIdAtom,
  ownerTypeAtom,
  ownerIdAtom,
  isDirtyAtom,
  isSavingAtom,
  isPublishingAtom,
  isLockedAtom,
  devicePreviewAtom,
  zoomAtom,
  selectedNodeIdAtom,
  activeRightPanelAtom,
  pageConfigAtom,
  canUndoAtom,
  canRedoAtom,
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Page Builder Store — Jotai Atoms', () => {
  describe('default values', () => {
    it('configIdAtom defaults to null', () => {
      const store = createStore();
      expect(store.get(configIdAtom)).toBeNull();
    });

    it('ownerTypeAtom defaults to "event"', () => {
      const store = createStore();
      expect(store.get(ownerTypeAtom)).toBe('event');
    });

    it('ownerIdAtom defaults to empty string', () => {
      const store = createStore();
      expect(store.get(ownerIdAtom)).toBe('');
    });

    it('isDirtyAtom defaults to false', () => {
      const store = createStore();
      expect(store.get(isDirtyAtom)).toBe(false);
    });

    it('isSavingAtom defaults to false', () => {
      const store = createStore();
      expect(store.get(isSavingAtom)).toBe(false);
    });

    it('isPublishingAtom defaults to false', () => {
      const store = createStore();
      expect(store.get(isPublishingAtom)).toBe(false);
    });

    it('isLockedAtom defaults to false', () => {
      const store = createStore();
      expect(store.get(isLockedAtom)).toBe(false);
    });

    it('devicePreviewAtom defaults to "desktop"', () => {
      const store = createStore();
      expect(store.get(devicePreviewAtom)).toBe('desktop');
    });

    it('zoomAtom defaults to 100', () => {
      const store = createStore();
      expect(store.get(zoomAtom)).toBe(100);
    });

    it('selectedNodeIdAtom defaults to null', () => {
      const store = createStore();
      expect(store.get(selectedNodeIdAtom)).toBeNull();
    });

    it('activeRightPanelAtom defaults to null', () => {
      const store = createStore();
      expect(store.get(activeRightPanelAtom)).toBeNull();
    });

    it('pageConfigAtom defaults to null', () => {
      const store = createStore();
      expect(store.get(pageConfigAtom)).toBeNull();
    });

    it('canUndoAtom defaults to false', () => {
      const store = createStore();
      expect(store.get(canUndoAtom)).toBe(false);
    });

    it('canRedoAtom defaults to false', () => {
      const store = createStore();
      expect(store.get(canRedoAtom)).toBe(false);
    });
  });

  describe('set and get', () => {
    it('configIdAtom can be set to a string', () => {
      const store = createStore();
      store.set(configIdAtom, 'cfg-abc');
      expect(store.get(configIdAtom)).toBe('cfg-abc');
    });

    it('ownerTypeAtom can be set to "space"', () => {
      const store = createStore();
      store.set(ownerTypeAtom, 'space');
      expect(store.get(ownerTypeAtom)).toBe('space');
    });

    it('ownerIdAtom can be set', () => {
      const store = createStore();
      store.set(ownerIdAtom, 'event-42');
      expect(store.get(ownerIdAtom)).toBe('event-42');
    });

    it('isDirtyAtom can be toggled', () => {
      const store = createStore();
      store.set(isDirtyAtom, true);
      expect(store.get(isDirtyAtom)).toBe(true);
      store.set(isDirtyAtom, false);
      expect(store.get(isDirtyAtom)).toBe(false);
    });

    it('devicePreviewAtom cycles through device modes', () => {
      const store = createStore();
      store.set(devicePreviewAtom, 'tablet');
      expect(store.get(devicePreviewAtom)).toBe('tablet');
      store.set(devicePreviewAtom, 'mobile');
      expect(store.get(devicePreviewAtom)).toBe('mobile');
      store.set(devicePreviewAtom, 'desktop');
      expect(store.get(devicePreviewAtom)).toBe('desktop');
    });

    it('zoomAtom can be set to arbitrary numbers', () => {
      const store = createStore();
      store.set(zoomAtom, 75);
      expect(store.get(zoomAtom)).toBe(75);
      store.set(zoomAtom, 150);
      expect(store.get(zoomAtom)).toBe(150);
    });

    it('selectedNodeIdAtom can be set and cleared', () => {
      const store = createStore();
      store.set(selectedNodeIdAtom, 'node-123');
      expect(store.get(selectedNodeIdAtom)).toBe('node-123');
      store.set(selectedNodeIdAtom, null);
      expect(store.get(selectedNodeIdAtom)).toBeNull();
    });

    it('activeRightPanelAtom accepts panel types', () => {
      const store = createStore();
      store.set(activeRightPanelAtom, 'properties');
      expect(store.get(activeRightPanelAtom)).toBe('properties');
      store.set(activeRightPanelAtom, 'theme');
      expect(store.get(activeRightPanelAtom)).toBe('theme');
      store.set(activeRightPanelAtom, null);
      expect(store.get(activeRightPanelAtom)).toBeNull();
    });

    it('pageConfigAtom holds a full PageConfig', () => {
      const store = createStore();
      store.set(pageConfigAtom, MOCK_CONFIG);
      expect(store.get(pageConfigAtom)).toEqual(MOCK_CONFIG);
    });

    it('pageConfigAtom can be cleared back to null', () => {
      const store = createStore();
      store.set(pageConfigAtom, MOCK_CONFIG);
      store.set(pageConfigAtom, null);
      expect(store.get(pageConfigAtom)).toBeNull();
    });
  });

  describe('store isolation', () => {
    it('separate stores do not share state', () => {
      const store1 = createStore();
      const store2 = createStore();

      store1.set(isDirtyAtom, true);
      store1.set(configIdAtom, 'cfg-1');

      expect(store2.get(isDirtyAtom)).toBe(false);
      expect(store2.get(configIdAtom)).toBeNull();
    });
  });
});
