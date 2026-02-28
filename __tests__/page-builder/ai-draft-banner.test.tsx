import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider, createStore } from 'jotai';

import { AIDraftBanner } from '$lib/components/features/page-builder/panels/AIDraftBanner';
import {
  aiDraftPhaseAtom,
  aiDraftErrorAtom,
} from '$lib/components/features/page-builder/store';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('$lib/components/core', () => ({
  Button: ({
    children,
    onClick,
    loading,
    variant,
    size,
    icon,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    variant?: string;
    size?: string;
    icon?: string;
  }) => (
    <button onClick={onClick} disabled={loading} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderBanner(
  store: ReturnType<typeof createStore>,
  overrides: Partial<{
    onApply: () => void;
    onRevert: () => void;
    onRetry: () => void;
    onDismissError: () => void;
  }> = {},
) {
  const props = {
    onApply: vi.fn(),
    onRevert: vi.fn(),
    onRetry: vi.fn(),
    onDismissError: vi.fn(),
    ...overrides,
  };
  const result = render(
    <Provider store={store}>
      <AIDraftBanner {...props} />
    </Provider>,
  );
  return { ...result, props };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AIDraftBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when phase is idle', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'idle');
    const { container } = renderBanner(store);
    expect(container.innerHTML).toBe('');
  });

  it('shows loading state with spinner and cancel button', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'loading');
    renderBanner(store);

    expect(screen.getByText(/AI is generating/)).not.toBeNull();
    expect(screen.getByRole('button', { name: /Cancel/ })).not.toBeNull();
  });

  it('shows preview state with Apply and Revert buttons', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'previewing');
    renderBanner(store);

    expect(screen.getByText(/AI suggestion ready/)).not.toBeNull();
    expect(screen.getByRole('button', { name: /Apply Changes/ })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Revert/ })).not.toBeNull();
  });

  it('calls onApply when Apply Changes is clicked', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'previewing');
    const { props } = renderBanner(store);

    fireEvent.click(screen.getByRole('button', { name: /Apply Changes/ }));
    expect(props.onApply).toHaveBeenCalledOnce();
  });

  it('calls onRevert when Revert is clicked', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'previewing');
    const { props } = renderBanner(store);

    fireEvent.click(screen.getByRole('button', { name: /Revert/ }));
    expect(props.onRevert).toHaveBeenCalledOnce();
  });

  it('shows retry button for retryable errors', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'error');
    store.set(aiDraftErrorAtom, new Error('Server error 500'));
    renderBanner(store);

    expect(screen.getByText(/AI edit failed/)).not.toBeNull();
    expect(screen.getByRole('button', { name: /Retry/ })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Revert/ })).not.toBeNull();
  });

  it('shows only dismiss for user_fixable errors', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'error');
    store.set(aiDraftErrorAtom, new Error('403 Forbidden'));
    renderBanner(store);

    expect(screen.getByText(/AI edit failed/)).not.toBeNull();
    expect(screen.queryByRole('button', { name: /Retry/ })).toBeNull();
    expect(screen.getByRole('button', { name: /Dismiss/ })).not.toBeNull();
  });

  it('shows red banner for fatal errors', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'error');
    store.set(aiDraftErrorAtom, new Error('Something completely unknown'));
    const { container } = renderBanner(store);

    const bannerDiv = container.firstElementChild as HTMLElement;
    expect(bannerDiv.className).toContain('bg-red-500');
  });

  it('calls onRetry when Retry is clicked', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'error');
    store.set(aiDraftErrorAtom, new Error('Server error 500'));
    const { props } = renderBanner(store);

    fireEvent.click(screen.getByRole('button', { name: /Retry/ }));
    expect(props.onRetry).toHaveBeenCalledOnce();
  });

  it('calls onDismissError when Dismiss is clicked', () => {
    const store = createStore();
    store.set(aiDraftPhaseAtom, 'error');
    store.set(aiDraftErrorAtom, new Error('403 Forbidden'));
    const { props } = renderBanner(store);

    fireEvent.click(screen.getByRole('button', { name: /Dismiss/ }));
    expect(props.onDismissError).toHaveBeenCalledOnce();
  });
});
