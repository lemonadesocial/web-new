import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';

// ─── Mocks ──────────────────────────────────────────────────

// Toast is imported from `$lib/components/core` barrel. Mock the whole barrel.
const toastSuccess = vi.fn();
const toastError = vi.fn();

const modalOpenMock = vi.fn();
const modalCloseMock = vi.fn();

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
      open: (...args: any[]) => modalOpenMock(...args),
      close: (...args: any[]) => modalCloseMock(...args),
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
  Chip: ({ children, variant }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react');
    return React.createElement('span', { 'data-variant': variant }, children);
  },
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
}));

vi.mock('$lib/utils/error', () => ({
  getErrorMessage: (e: unknown, fallback: string) => {
    if (e instanceof Error) return e.message;
    if (typeof e === 'string') return e;
    return fallback;
  },
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

// ─── Locked connection test data ────────────────────────────

const lockedConnection = {
  id: 'conn-locked',
  connectorType: 'airtable',
  status: 'locked',
  installedBy: 'user-1',
  installedAt: new Date().toISOString(),
  enabled: true,
};

// ─── Locked-state + error toast tests ──────────────────────

describe('Connectors — locked-state card rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    toastSuccess.mockReset();
    toastError.mockReset();
    disconnectMock.mockReset();
    useQueryMock.mockReset();
    useMutationMock.mockReset();

    // Return a locked connection from SpaceConnections
    useQueryMock.mockImplementation((_doc: any, options: any) => {
      if (options?.variables?.spaceId) {
        return {
          data: { spaceConnections: [lockedConnection] },
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

    setupMutations();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders lock icon, "Locked" chip, "Contact support" text, and no Connect/Disconnect UI', async () => {
    const { Connectors } = await import(
      '../../lib/components/features/upgrade-to-pro/Connectors'
    );

    await act(async () => {
      render(<Connectors space={space} />);
    });

    // "Locked" chip text is visible
    await waitFor(() => {
      expect(screen.getByText('Locked')).toBeTruthy();
    });

    // Lock icon is rendered (inside the chip)
    const lockedChip = screen.getByText('Locked');
    const lockIcon = lockedChip.parentElement?.querySelector('.icon-lock');
    expect(lockIcon).toBeTruthy();

    // "Contact support" text is visible
    expect(screen.getByText('Contact support')).toBeTruthy();

    // Connect chip should NOT be rendered
    expect(screen.queryByText('Connect')).toBeNull();

    // Connected chip should NOT be rendered
    expect(screen.queryByText('Connected')).toBeNull();

    // Disconnect menu item should NOT be rendered
    expect(screen.queryByText('Disconnect')).toBeNull();

    // View Actions menu item should NOT be rendered
    expect(screen.queryByText('View Actions')).toBeNull();
  });
});

describe('Connectors — submitApiKey error toast interception', () => {
  let capturedSubmitApiKeyOnError: ((error: unknown) => void) | null = null;
  let capturedModalComponent: any = null;
  let capturedModalProps: any = null;

  beforeEach(() => {
    vi.clearAllMocks();
    toastSuccess.mockReset();
    toastError.mockReset();
    disconnectMock.mockReset();
    useQueryMock.mockReset();
    useMutationMock.mockReset();
    capturedSubmitApiKeyOnError = null;
    capturedModalComponent = null;
    capturedModalProps = null;

    // Return unconnected state so the user can trigger connect flow
    useQueryMock.mockImplementation((_doc: any, options: any) => {
      if (options?.variables?.spaceId) {
        return {
          data: { spaceConnections: [] },
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

    // ConnectPlatform returns requiresApiKey to trigger the ApiKeyModal
    const connectMock = vi.fn().mockResolvedValue({
      data: {
        connectPlatform: {
          connectionId: 'conn-new',
          authUrl: null,
          requiresApiKey: true,
        },
      },
    });

    // Capture modal.open calls to render ApiKeyModal manually
    modalOpenMock.mockImplementation((Component: any, options: any) => {
      capturedModalComponent = Component;
      capturedModalProps = options?.props;
    });

    // First round of useMutation: for ConnectorCard (ConnectPlatform + DisconnectPlatform)
    useMutationMock.mockImplementation((_doc: any, _opts: any) => {
      // Default: return connectMock for first call, disconnectMock for second
      const callCount = useMutationMock.mock.calls.length;
      if (callCount % 2 === 1) {
        return [connectMock, { loading: false, error: null, data: null, client: {} }, {}];
      }
      return [disconnectMock, { loading: false, error: null, data: null, client: {} }, {}];
    });
  });

  afterEach(() => {
    cleanup();
  });

  async function triggerApiKeyModal() {
    const { Connectors } = await import(
      '../../lib/components/features/upgrade-to-pro/Connectors'
    );

    await act(async () => {
      render(<Connectors space={space} />);
    });

    // Click the connector card to trigger handleConnect → modal.open(ApiKeyModal, ...)
    const connectorName = screen.getByText('Airtable');
    const card = connectorName.closest('div')?.parentElement;

    await act(async () => {
      if (card) fireEvent.click(card);
    });

    // Wait for the connectPlatform promise to resolve and modal.open to be called
    await waitFor(() => {
      expect(modalOpenMock).toHaveBeenCalled();
    });

    // Now re-mock useMutation to capture the SubmitApiKey onError
    // (ApiKeyModal will call useMutation when it renders)
    useMutationMock.mockImplementation((_doc: any, opts: any) => {
      if (opts?.onError) {
        capturedSubmitApiKeyOnError = opts.onError;
      }
      return [vi.fn().mockResolvedValue({ data: null }), { loading: false, error: null, data: null, client: {} }, {}];
    });

    // Render the captured ApiKeyModal component
    if (capturedModalComponent && capturedModalProps) {
      cleanup();
      await act(async () => {
        render(React.createElement(capturedModalComponent, capturedModalProps));
      });
    }
  }

  it('shows friendly message for "Too many attempts" error', async () => {
    await triggerApiKeyModal();

    // capturedSubmitApiKeyOnError should now be set from ApiKeyModal's useMutation
    expect(capturedSubmitApiKeyOnError).not.toBeNull();

    // Invoke the onError handler with a rate-limit error
    act(() => {
      capturedSubmitApiKeyOnError!(new Error('Too many attempts. Please try again later.'));
    });

    expect(toastError).toHaveBeenCalledWith('Too many attempts. Please wait an hour before trying again.');
    // The raw error string should NOT have been passed through
    expect(toastError).not.toHaveBeenCalledWith('Too many attempts. Please try again later.');
  });

  it('shows friendly message for "Connection is locked" error', async () => {
    await triggerApiKeyModal();

    expect(capturedSubmitApiKeyOnError).not.toBeNull();

    act(() => {
      capturedSubmitApiKeyOnError!(new Error('Connection is locked. Contact support.'));
    });

    expect(toastError).toHaveBeenCalledWith(
      'This connection has been locked due to too many failed attempts. Please contact support to unlock it.',
    );
    expect(toastError).not.toHaveBeenCalledWith('Connection is locked. Contact support.');
  });
});

describe('Connectors — connectPlatform error toast interception', () => {
  let capturedConnectPlatformOnError: ((error: unknown) => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    toastSuccess.mockReset();
    toastError.mockReset();
    disconnectMock.mockReset();
    useQueryMock.mockReset();
    useMutationMock.mockReset();
    capturedConnectPlatformOnError = null;

    // Return unconnected state so the user can trigger connect flow
    useQueryMock.mockImplementation((_doc: any, options: any) => {
      if (options?.variables?.spaceId) {
        return {
          data: { spaceConnections: [] },
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

    // Capture the connectPlatform onError handler from the first useMutation call
    useMutationMock.mockImplementation((_doc: any, opts: any) => {
      const callCount = useMutationMock.mock.calls.length;
      // First call per card = ConnectPlatform, second = DisconnectPlatform
      if (callCount % 2 === 1 && opts?.onError) {
        capturedConnectPlatformOnError = opts.onError;
      }
      return [vi.fn().mockResolvedValue({ data: null }), { loading: false, error: null, data: null, client: {} }, {}];
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('shows friendly message for "Connection is locked" error from connectPlatform', async () => {
    const { Connectors } = await import(
      '../../lib/components/features/upgrade-to-pro/Connectors'
    );

    await act(async () => {
      render(<Connectors space={space} />);
    });

    expect(capturedConnectPlatformOnError).not.toBeNull();

    act(() => {
      capturedConnectPlatformOnError!(new Error('Connection is locked. Contact support.'));
    });

    expect(toastError).toHaveBeenCalledWith(
      'This connection has been locked due to too many failed attempts. Please contact support to unlock it.',
    );
    expect(toastError).not.toHaveBeenCalledWith('Connection is locked. Contact support.');
  });

  it('shows friendly message for "too many attempts" error from connectPlatform (case-insensitive)', async () => {
    const { Connectors } = await import(
      '../../lib/components/features/upgrade-to-pro/Connectors'
    );

    await act(async () => {
      render(<Connectors space={space} />);
    });

    expect(capturedConnectPlatformOnError).not.toBeNull();

    act(() => {
      capturedConnectPlatformOnError!(new Error('TOO MANY ATTEMPTS. Please try again later.'));
    });

    expect(toastError).toHaveBeenCalledWith('Too many attempts. Please wait an hour before trying again.');
  });

  it('falls back to generic error for unrecognized connectPlatform errors', async () => {
    const { Connectors } = await import(
      '../../lib/components/features/upgrade-to-pro/Connectors'
    );

    await act(async () => {
      render(<Connectors space={space} />);
    });

    expect(capturedConnectPlatformOnError).not.toBeNull();

    act(() => {
      capturedConnectPlatformOnError!(new Error('Something unexpected'));
    });

    // getErrorMessage returns the Error's message when one exists, so the fallback
    // string is only used when the error has no extractable message. Here the mock
    // mirrors real behaviour: Error('Something unexpected') → 'Something unexpected'.
    expect(toastError).toHaveBeenCalledWith('Something unexpected');
  });
});

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
