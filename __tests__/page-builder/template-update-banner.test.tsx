import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider, createStore } from 'jotai';

import { TemplateUpdateBanner } from '$lib/components/features/page-builder/panels/TemplateUpdateBanner';
import { isDirtyAtom, pageConfigAtom } from '$lib/components/features/page-builder/store';
import { DEFAULT_THEME } from '$lib/components/features/page-builder/types';

const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock('$lib/graphql/request/hooks', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
}));

vi.mock('$lib/components/core/toast', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('$lib/components/core', () => ({
  Button: ({
    children,
    onClick,
    loading,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
  }) => (
    <button onClick={onClick} disabled={loading}>
      {children}
    </button>
  ),
}));

function makeConfig(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'cfg-1',
    owner_type: 'event',
    owner_id: 'owner-1',
    created_by: 'user-1',
    status: 'draft',
    version: 1,
    theme: DEFAULT_THEME,
    sections: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    template_id: 'tpl-1',
    ...overrides,
  };
}

describe('TemplateUpdateBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it('does not render when no update is available', () => {
    mockUseQuery.mockReturnValue({
      data: {
        checkTemplateUpdate: {
          available: false,
        },
      },
      loading: false,
      refetch: vi.fn(),
    });
    mockUseMutation.mockReturnValue([vi.fn(), { loading: false }]);

    const store = createStore();
    render(
      <Provider store={store}>
        <TemplateUpdateBanner configId="cfg-1" templateId="tpl-1" />
      </Provider>,
    );

    expect(screen.queryByText(/Template update/i)).toBeNull();
  });

  it('renders available update and toggles summary', () => {
    mockUseQuery.mockReturnValue({
      data: {
        checkTemplateUpdate: {
          available: true,
          current_version: '1.0',
          latest_version: '1.1',
          changelog_summary: 'Added responsive spacing fixes',
          breaking_changes: true,
        },
      },
      loading: false,
      refetch: vi.fn(),
    });
    mockUseMutation.mockReturnValue([vi.fn(), { loading: false }]);

    const store = createStore();
    render(
      <Provider store={store}>
        <TemplateUpdateBanner configId="cfg-1" templateId="tpl-1" />
      </Provider>,
    );

    expect(screen.getByText(/v1.0/i)).not.toBeNull();
    expect(screen.getByRole('button', { name: /View Changes/i })).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /View Changes/i }));
    expect(screen.getByText('Added responsive spacing fixes')).not.toBeNull();
    expect(screen.getByText(/Breaking changes/i)).not.toBeNull();
  });

  it('applies update and syncs store state', async () => {
    const refetch = vi.fn();
    const updatedConfig = makeConfig({ version: 2, template_version_installed: '1.1' });
    const mutate = vi.fn().mockResolvedValue({
      data: { applyTemplateUpdate: updatedConfig },
      error: null,
      loading: false,
      client: {},
    });

    mockUseQuery.mockReturnValue({
      data: {
        checkTemplateUpdate: {
          available: true,
          current_version: '1.0',
          latest_version: '1.1',
        },
      },
      loading: false,
      refetch,
    });
    mockUseMutation.mockReturnValue([mutate, { loading: false }]);

    const store = createStore();
    store.set(pageConfigAtom, makeConfig());

    render(
      <Provider store={store}>
        <TemplateUpdateBanner configId="cfg-1" templateId="tpl-1" />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Update Now/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({ variables: { config_id: 'cfg-1' } });
      expect(store.get(isDirtyAtom)).toBe(true);
      expect(store.get(pageConfigAtom)).toMatchObject({ version: 2 });
      expect(refetch).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith('Template updated from v1.0 to v1.1');
    });
  });
});
