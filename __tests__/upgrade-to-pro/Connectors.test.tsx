import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';

// ─── Mocks ──────────────────────────────────────────────────

// Toast is imported from `$lib/components/core` barrel. Mock the whole barrel.
const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock('$lib/components/core', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    Button: ({ children, onClick, loading, icon, ...rest }: any) =>
      React.createElement(
        'button',
        {
          onClick,
          disabled: !!loading,
          'aria-label': rest['aria-label'],
          'data-testid': rest['data-testid'],
          'data-icon': icon,
        },
        children,
      ),
    Card: {
      Root: ({ children, onClick }: any) => React.createElement('div', { onClick }, children),
      Content: ({ children }: any) => React.createElement('div', null, children),
    },
    InputField: ({ label, value, onChangeText, type }: any) =>
      React.createElement('input', {
        'aria-label': label,
        value,
        type,
        onChange: (e: any) => onChangeText?.(e.target.value),
      }),
    Skeleton: () => React.createElement('div', { 'data-testid': 'skeleton' }),
    toast: {
      success: (...args: any[]) => toastSuccess(...args),
      error: (...args: any[]) => toastError(...args),
    },
    modal: {
      open: vi.fn(),
      close: vi.fn(),
    },
    Menu: {
      // Flatten Menu so both Trigger and Content render inline without a portal
      Root: ({ children }: any) => React.createElement('div', null, children),
      Trigger: ({ children }: any) => React.createElement('div', null, children),
      Content: ({ children }: any) => {
        // Support render-prop pattern ({ toggle }) => JSX
        const toggle = () => {};
        const rendered = typeof children === 'function' ? children({ toggle, close: () => {} }) : children;
        return React.createElement('div', null, rendered);
      },
    },
    MenuItem: ({ children, onClick }: any) =>
      React.createElement('div', { onClick, role: 'menuitem' }, children),
  };
});

vi.mock('$lib/components/core/chip/Chip', () => ({
  Chip: ({ children }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react');
    return React.createElement('span', null, children);
  },
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
}));

vi.mock('$lib/utils/error', () => ({
  getErrorMessage: (_e: unknown, fallback: string) => fallback,
}));

vi.mock('../../lib/components/features/upgrade-to-pro/utils', () => ({
  CONNECTOR_ICONS: {},
  getConnectorErrorMessage: (e: string) => e,
}));

// Thin GraphQL client — mock useQuery and useMutation
const disconnectMock = vi.fn();
const useQueryMock = vi.fn();
const useMutationMock = vi.fn();

vi.mock('$lib/graphql/request', () => ({
  useQuery: (...args: any[]) => useQueryMock(...args),
  useMutation: (...args: any[]) => useMutationMock(...args),
}));

// ─── Test data ──────────────────────────────────────────────

const connectorDef = {
  id: 'airtable',
  name: 'Airtable',
  description: 'Sync with Airtable',
  icon: 'airtable',
  category: 'productivity',
  authType: 'oauth',
  capabilities: ['import'],
  actions: [],
};

const connection = {
  id: 'conn-1',
  connectorType: 'airtable',
  status: 'connected',
  installedBy: 'user-1',
  installedAt: new Date().toISOString(),
  enabled: true,
};

const space = { _id: 'space-1', slug: 'test-space' } as any;

// ─── Shared setup ───────────────────────────────────────────

function setupQueries() {
  // First call: AvailableConnectors; second call: SpaceConnections.
  useQueryMock.mockImplementation((doc: any, options: any) => {
    // variables.spaceId => SpaceConnections call
    if (options?.variables?.spaceId) {
      return {
        data: { spaceConnections: [connection] },
        loading: false,
        error: null,
        refetch: vi.fn().mockResolvedValue(undefined),
      };
    }
    return {
      data: { availableConnectors: [connectorDef] },
      loading: false,
      error: null,
      refetch: vi.fn().mockResolvedValue(undefined),
    };
  });
}

function setupMutations() {
  // useMutation is called twice inside ConnectorCard: once for ConnectPlatform,
  // once for DisconnectPlatform. We identify the disconnect call via the mock
  // call order — the SECOND useMutation invocation inside ConnectorCard is the
  // disconnect hook. We return a tuple per call.
  useMutationMock.mockImplementation(() => {
    // Return generic connect mutation tuple by default; we'll override per test
    // by inspecting the call count.
    const callIdx = useMutationMock.mock.calls.length;
    // Odd call (1st of each card) = connect, even call = disconnect
    const isDisconnect = callIdx % 2 === 0;
    if (isDisconnect) {
      return [disconnectMock, { loading: false, error: null, data: null, client: {} }, {}];
    }
    return [vi.fn().mockResolvedValue({ data: null }), { loading: false, error: null, data: null, client: {} }, {}];
  });
}

describe('Connectors — DisconnectResult handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    toastSuccess.mockReset();
    toastError.mockReset();
    disconnectMock.mockReset();
    useQueryMock.mockReset();
    useMutationMock.mockReset();
    setupQueries();
    setupMutations();
  });

  afterEach(() => {
    cleanup();
  });

  it('success + tokenRevoked=true → toast.success only', async () => {
    disconnectMock.mockResolvedValue({
      data: {
        disconnectPlatform: {
          success: true,
          tokenRevoked: true,
          revocationError: null,
        },
      },
    });

    const { Connectors } = await import(
      '../../lib/components/features/upgrade-to-pro/Connectors'
    );

    await act(async () => {
      render(<Connectors space={space} />);
    });

    // Click the "Disconnect" MenuItem
    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Disconnect'));
    });

    await waitFor(() => {
      expect(disconnectMock).toHaveBeenCalledWith({ variables: { connectionId: 'conn-1' } });
    });

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledTimes(1);
      expect(toastSuccess).toHaveBeenCalledWith('Connector disconnected.');
    });
    expect(toastError).not.toHaveBeenCalled();
  });

  it('success + tokenRevoked=false → toast.error with sanitized revocationError; no success toast', async () => {
    const sanitized =
      'Token revocation failed. Please revoke access manually on the external platform.';
    disconnectMock.mockResolvedValue({
      data: {
        disconnectPlatform: {
          success: true,
          tokenRevoked: false,
          revocationError: sanitized,
        },
      },
    });

    const { Connectors } = await import(
      '../../lib/components/features/upgrade-to-pro/Connectors'
    );

    await act(async () => {
      render(<Connectors space={space} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Disconnect'));
    });

    await waitFor(() => {
      expect(disconnectMock).toHaveBeenCalledWith({ variables: { connectionId: 'conn-1' } });
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledTimes(1);
      expect(toastError).toHaveBeenCalledWith(sanitized);
    });
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
