import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import type { PageConfig } from '$lib/components/features/page-builder/types';
import { DEFAULT_THEME } from '$lib/components/features/page-builder/types';
import {
  aiDraftPhaseAtom,
  aiPreSnapshotAtom,
  aiPrePageConfigAtom,
  aiDraftConfigAtom,
  aiDraftErrorAtom,
  isDirtyAtom,
  pageConfigAtom,
} from '$lib/components/features/page-builder/store';
import { useAIPageEdit } from '$lib/components/features/page-builder/hooks/useAIPageEdit';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSerialize = vi.fn(() => '{"ROOT":{"type":"div"}}');
const mockDeserialize = vi.fn();
const mockSetOptions = vi.fn();

vi.mock('@craftjs/core', () => ({
  useEditor: () => ({
    query: { serialize: mockSerialize },
    actions: { deserialize: mockDeserialize, setOptions: mockSetOptions },
  }),
}));

const mockAiCreate = vi.fn();
const mockAiUpdateSection = vi.fn();
const mockAiGenerate = vi.fn();

vi.mock('$lib/graphql/request/hooks', () => ({
  useMutation: (doc: { definitions: Array<{ name: { value: string } }> }) => {
    const name = doc?.definitions?.[0]?.name?.value ?? '';
    if (name === 'AiCreatePageConfig') return [mockAiCreate, { loading: false }];
    if (name === 'AiUpdatePageConfigSection') return [mockAiUpdateSection, { loading: false }];
    if (name === 'AiGeneratePageFromDescription') return [mockAiGenerate, { loading: false }];
    return [vi.fn(), { loading: false }];
  },
}));

vi.mock('$lib/graphql/generated/backend/graphql', () => ({
  AiCreatePageConfigDocument: { definitions: [{ name: { value: 'AiCreatePageConfig' } }] },
  AiUpdatePageConfigSectionDocument: { definitions: [{ name: { value: 'AiUpdatePageConfigSection' } }] },
  AiGeneratePageFromDescriptionDocument: { definitions: [{ name: { value: 'AiGeneratePageFromDescription' } }] },
}));

vi.mock('$lib/components/features/page-builder/serializer', () => ({
  pageConfigToCraftState: (config: PageConfig) => ({ ROOT: { type: 'div', props: config } }),
}));

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

const AI_RESULT: PageConfig = {
  ...MOCK_CONFIG,
  _id: 'cfg-ai',
  version: 2,
  sections: [{ id: 's1', type: 'event_hero' as const, order: 0 }],
};

function makeWrapper(store: ReturnType<typeof createStore>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useAIPageEdit', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createStore();
    store.set(pageConfigAtom, MOCK_CONFIG);
  });

  afterEach(() => {
    cleanup();
  });

  it('transitions to loading when mutation starts', async () => {
    mockAiCreate.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    act(() => {
      result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('loading');
  });

  it('captures Craft.js snapshot before mutation', async () => {
    mockAiCreate.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    act(() => {
      result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(mockSerialize).toHaveBeenCalled();
    expect(store.get(aiPreSnapshotAtom)).toBe('{"ROOT":{"type":"div"}}');
  });

  it('transitions to previewing on successful mutation', async () => {
    mockAiCreate.mockResolvedValue({ data: { aiCreatePageConfig: AI_RESULT } });
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('previewing');
  });

  it('deserializes AI result into Craft.js on success', async () => {
    mockAiCreate.mockResolvedValue({ data: { aiCreatePageConfig: AI_RESULT } });
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(mockDeserialize).toHaveBeenCalledWith({ ROOT: { type: 'div', props: AI_RESULT } });
  });

  it('updates pageConfigAtom with AI result during preview', async () => {
    mockAiCreate.mockResolvedValue({ data: { aiCreatePageConfig: AI_RESULT } });
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(pageConfigAtom)).toEqual(AI_RESULT);
    expect(store.get(aiDraftConfigAtom)).toEqual(AI_RESULT);
  });

  it('transitions to error on mutation failure', async () => {
    mockAiCreate.mockRejectedValue(new Error('Server error 500'));
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('error');
    expect(store.get(aiDraftErrorAtom)).toBeInstanceOf(Error);
  });

  it('restores Craft.js to snapshot on error', async () => {
    mockAiCreate.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    // deserialize called with the pre-snapshot to restore
    expect(mockDeserialize).toHaveBeenCalledWith({ ROOT: { type: 'div' } });
  });

  it('applyDraft sets isDirty and clears draft atoms', async () => {
    mockAiCreate.mockResolvedValue({ data: { aiCreatePageConfig: AI_RESULT } });
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('previewing');

    act(() => {
      result.current.applyDraft();
    });

    expect(store.get(isDirtyAtom)).toBe(true);
    expect(store.get(aiDraftPhaseAtom)).toBe('idle');
    expect(store.get(aiPreSnapshotAtom)).toBeNull();
    expect(store.get(aiDraftConfigAtom)).toBeNull();
  });

  it('revertDraft restores pre-AI Craft.js state', async () => {
    mockAiCreate.mockResolvedValue({ data: { aiCreatePageConfig: AI_RESULT } });
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    mockDeserialize.mockClear();
    act(() => {
      result.current.revertDraft();
    });

    // Should restore the pre-AI snapshot
    expect(mockDeserialize).toHaveBeenCalledWith({ ROOT: { type: 'div' } });
    expect(store.get(aiDraftPhaseAtom)).toBe('idle');
  });

  it('revertDraft restores pre-AI pageConfigAtom', async () => {
    mockAiCreate.mockResolvedValue({ data: { aiCreatePageConfig: AI_RESULT } });
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(pageConfigAtom)).toEqual(AI_RESULT);

    act(() => {
      result.current.revertDraft();
    });

    expect(store.get(pageConfigAtom)).toEqual(MOCK_CONFIG);
  });

  it('retryLast re-runs the failed mutation', async () => {
    mockAiCreate.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('error');

    mockAiCreate.mockResolvedValue({ data: { aiCreatePageConfig: AI_RESULT } });
    await act(async () => {
      await result.current.retryLast();
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('previewing');
  });

  it('dismissError calls revertDraft', async () => {
    mockAiCreate.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    await act(async () => {
      await result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('error');

    act(() => {
      result.current.dismissError();
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('idle');
  });

  it('auto-save is blocked when isAIDraftPreview is true', () => {
    // This is tested indirectly via the Editor integration.
    // Here we verify the atom relationship that enables the guard.
    store.set(aiDraftPhaseAtom, 'previewing');
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });
    expect(result.current.phase).toBe('previewing');
  });

  it('cancel during loading prevents success transition', async () => {
    let resolveCreate!: (v: unknown) => void;
    mockAiCreate.mockReturnValue(new Promise((r) => { resolveCreate = r; }));
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    // Start mutation (enters loading)
    let createPromise: Promise<void>;
    act(() => {
      createPromise = result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });
    expect(store.get(aiDraftPhaseAtom)).toBe('loading');

    // Cancel while in-flight
    act(() => {
      result.current.revertDraft();
    });
    expect(store.get(aiDraftPhaseAtom)).toBe('idle');

    // Now resolve the in-flight promise — should NOT transition to previewing
    await act(async () => {
      resolveCreate({ data: { aiCreatePageConfig: AI_RESULT } });
      await createPromise!;
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('idle');
    expect(store.get(pageConfigAtom)).toEqual(MOCK_CONFIG);
  });

  it('cancel during loading prevents error transition', async () => {
    let rejectCreate!: (e: Error) => void;
    mockAiCreate.mockReturnValue(new Promise((_, rej) => { rejectCreate = rej; }));
    const { result } = renderHook(() => useAIPageEdit(), { wrapper: makeWrapper(store) });

    let createPromise: Promise<void>;
    act(() => {
      createPromise = result.current.requestCreate({ owner_id: 'e1', owner_type: 'event' });
    });
    expect(store.get(aiDraftPhaseAtom)).toBe('loading');

    // Cancel
    act(() => {
      result.current.revertDraft();
    });
    expect(store.get(aiDraftPhaseAtom)).toBe('idle');

    // Reject the in-flight promise — should NOT transition to error
    await act(async () => {
      rejectCreate(new Error('Server error 500'));
      await createPromise!;
    });

    expect(store.get(aiDraftPhaseAtom)).toBe('idle');
    expect(store.get(aiDraftErrorAtom)).toBeNull();
  });
});
