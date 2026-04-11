import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import { getDefaultStore } from 'jotai';

// ---- Mock browser APIs not available in jsdom ----
vi.stubGlobal('localStorage', {
  clear: vi.fn(),
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
});

vi.stubGlobal('sessionStorage', {
  clear: vi.fn(),
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
});

// ---- Mock modules ----
const mockCreateClient = vi.fn();
const mockDispose = vi.fn();
let capturedOnClosed: ((event: unknown) => void) | null = null;

vi.mock('graphql-ws', () => ({
  createClient: (opts: any) => {
    mockCreateClient(opts);
    // Capture the closed handler for testing
    if (opts.on?.closed) {
      capturedOnClosed = opts.on.closed;
    }
    return {
      subscribe: vi.fn(() => vi.fn()),
      dispose: mockDispose,
      on: vi.fn(),
    };
  },
}));

vi.mock('$lib/jotai', () => {
  const { atom } = require('jotai');
  const sessionAtom = atom<any>(null);
  const hydraClientIdAtom = atom<string | null>(null);
  const userAtom = atom<any>(null);
  return { sessionAtom, hydraClientIdAtom, userAtom };
});

vi.mock('$lib/utils/ory', () => ({
  ory: {
    createBrowserLogoutFlow: vi.fn().mockResolvedValue({ data: { logout_token: 'test-token' } }),
    updateLogoutFlow: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@sentry/nextjs', () => ({
  setUser: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/test',
}));

vi.mock('$lib/utils/error', () => ({
  getErrorMessage: (e: unknown) => (e instanceof Error ? e.message : String(e)),
}));

// Mock the toast and modal
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockModalOpen = vi.fn();
const mockModalClose = vi.fn();

vi.mock('$lib/components/core', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid={props['data-testid']} disabled={props.disabled}>
      {children}
    </button>
  ),
  toast: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
  modal: {
    open: (...args: any[]) => mockModalOpen(...args),
    close: (...args: any[]) => mockModalClose(...args),
  },
  Card: { Content: ({ children, ...props }: any) => <div {...props}>{children}</div> },
}));

vi.mock('$lib/components/core/dialog/modal', () => ({
  ModalContent: ({ children, title }: any) => (
    <div data-testid="modal-content">
      <p>{title}</p>
      {children}
    </div>
  ),
}));

// Mock the thin GraphQL client's useMutation
const mockMutate = vi.fn().mockResolvedValue({ data: null });

vi.mock('$lib/graphql/request', () => {
  // Return a stable reference so React hooks don't infinite-loop
  const stableMutate = (...args: any[]) => (globalThis as any).__mockMutate(...args);
  const stableResult = [stableMutate, { data: null, error: null, loading: false, client: {} }];
  return {
    useMutation: () => stableResult,
    GraphqlClientProvider: ({ children }: any) => children,
  };
});

vi.mock('$lib/graphql/request/instances', () => ({
  defaultClient: {},
}));

// Wire up the global reference for the stable mock
(globalThis as any).__mockMutate = mockMutate;

// ============================================================
// Test Suite 1: Close-code handler branching
// ============================================================
describe('WebSocket close-code handler', () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnClosed = null;
    originalLocation = window.location;
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost:3000/test' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  // Import the provider to trigger createClient and capture the handler
  async function mountProvider() {
    // Dynamic import to ensure mocks are set up
    const { GraphQLWSProvider } = await import('$lib/graphql/subscription/provider');
    const { sessionAtom } = await import('$lib/jotai');

    await act(async () => {
      render(
        <GraphQLWSProvider url="ws://test/graphql" connectionParams={{}}>
          <div>child</div>
        </GraphQLWSProvider>,
      );
    });

    return { sessionAtom };
  }

  it('4401 clears local auth state and routes to /login (SESSION REVOKED)', async () => {
    const { sessionAtom } = await mountProvider();
    expect(capturedOnClosed).toBeTruthy();

    const store = getDefaultStore();
    store.set(sessionAtom, { token: 'some-token' });

    capturedOnClosed!({ code: 4401 });

    expect(store.get(sessionAtom)).toBeNull();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  it('4403 triggers silent refresh and reconnect (NOT logout, NOT route change)', async () => {
    const { sessionAtom } = await mountProvider();
    expect(capturedOnClosed).toBeTruthy();

    const store = getDefaultStore();
    store.set(sessionAtom, { token: 'some-token' });

    capturedOnClosed!({ code: 4403 });

    // Session should NOT be cleared
    expect(store.get(sessionAtom)).toEqual({ token: 'some-token' });
    // Should NOT redirect
    expect(window.location.href).toBe('http://localhost:3000/test');
    expect(localStorage.clear).not.toHaveBeenCalled();
  });

  it('1006 triggers reconnect with backoff, NOT logout', async () => {
    const { sessionAtom } = await mountProvider();
    expect(capturedOnClosed).toBeTruthy();

    const store = getDefaultStore();
    store.set(sessionAtom, { token: 'some-token' });

    capturedOnClosed!({ code: 1006 });

    expect(store.get(sessionAtom)).toEqual({ token: 'some-token' });
    expect(window.location.href).toBe('http://localhost:3000/test');
    expect(localStorage.clear).not.toHaveBeenCalled();
  });

  it('1011 triggers reconnect with backoff, NOT logout', async () => {
    const { sessionAtom } = await mountProvider();
    expect(capturedOnClosed).toBeTruthy();

    const store = getDefaultStore();
    store.set(sessionAtom, { token: 'some-token' });

    capturedOnClosed!({ code: 1011 });

    expect(store.get(sessionAtom)).toEqual({ token: 'some-token' });
    expect(window.location.href).toBe('http://localhost:3000/test');
    expect(localStorage.clear).not.toHaveBeenCalled();
  });

  it('1012 triggers reconnect with backoff, NOT logout', async () => {
    const { sessionAtom } = await mountProvider();
    expect(capturedOnClosed).toBeTruthy();

    const store = getDefaultStore();
    store.set(sessionAtom, { token: 'some-token' });

    capturedOnClosed!({ code: 1012 });

    expect(store.get(sessionAtom)).toEqual({ token: 'some-token' });
    expect(window.location.href).toBe('http://localhost:3000/test');
    expect(localStorage.clear).not.toHaveBeenCalled();
  });
});

// ============================================================
// Test Suite 2: Sessions page rendering
// ============================================================
describe('Active Sessions page', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockMutate.mockResolvedValue({ data: null });
    (globalThis as any).__mockMutate = mockMutate;
  });

  it('renders sessions from mocked getMyActiveSessions response', async () => {
    const mockSessions = [
      {
        _id: 'sess-1',
        kratos_identity_id: 'id-1',
        kratos_session_id: 'ks-1',
        device_name: 'Chrome on macOS',
        device_model: 'MacBook Pro',
        os: 'macOS 14',
        app_version: '10.7.0',
        client_type: 'web',
        ip_address: '192.168.1.1',
        last_active_at: new Date().toISOString(),
        is_current: true,
        has_active_websocket: true,
      },
      {
        _id: 'sess-2',
        kratos_identity_id: 'id-1',
        kratos_session_id: 'ks-2',
        device_name: 'Safari on iPhone',
        device_model: 'iPhone 15',
        os: 'iOS 17',
        app_version: '10.6.0',
        client_type: 'mobile',
        ip_address: '10.0.0.1',
        last_active_at: new Date(Date.now() - 3600000).toISOString(),
        is_current: false,
        has_active_websocket: false,
      },
    ];

    mockMutate.mockResolvedValueOnce({
      data: { getMyActiveSessions: mockSessions },
    });

    const ActiveSessionsPage = (await import(
      '../app/[domain]/(default)/settings/security/sessions/page'
    )).default;

    await act(async () => {
      render(<ActiveSessionsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Chrome on macOS')).toBeTruthy();
      expect(screen.getByText('Safari on iPhone')).toBeTruthy();
      expect(screen.getByText('Current')).toBeTruthy();
    });
  });

  it('revoke button triggers revokeMySession', async () => {
    const mockSessions = [
      {
        _id: 'sess-1',
        kratos_identity_id: 'id-1',
        kratos_session_id: 'ks-1',
        device_name: 'Current Device',
        device_model: '',
        os: 'macOS',
        app_version: '10.7.0',
        client_type: 'web',
        ip_address: '1.1.1.1',
        last_active_at: new Date().toISOString(),
        is_current: true,
        has_active_websocket: true,
      },
      {
        _id: 'sess-2',
        kratos_identity_id: 'id-1',
        kratos_session_id: 'ks-2',
        device_name: 'Other Device',
        device_model: '',
        os: 'Windows',
        app_version: '10.6.0',
        client_type: 'web',
        ip_address: '2.2.2.2',
        last_active_at: new Date().toISOString(),
        is_current: false,
        has_active_websocket: false,
      },
    ];

    mockMutate
      .mockResolvedValueOnce({ data: { getMyActiveSessions: mockSessions } })
      .mockResolvedValueOnce({ data: { revokeMySession: mockSessions[1] } });

    const ActiveSessionsPage = (await import(
      '../app/[domain]/(default)/settings/security/sessions/page'
    )).default;

    await act(async () => {
      render(<ActiveSessionsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Other Device')).toBeTruthy();
    });

    const revokeButton = screen.getByTestId('revoke-button');
    await act(async () => {
      fireEvent.click(revokeButton);
    });

    // Second call should be the revoke with the session ID
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { sessionId: 'sess-2' } }),
    );
  });
});

// ============================================================
// Test Suite 3: Step-up modal flow
// ============================================================
describe('Step-up verification modal flow', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockMutate.mockResolvedValue({ data: null });
    (globalThis as any).__mockMutate = mockMutate;
  });

  it('Log Out of All Other Devices button opens the step-up modal', async () => {
    const mockSessions = [
      {
        _id: 'sess-1',
        kratos_identity_id: 'id-1',
        kratos_session_id: 'ks-1',
        device_name: 'Current',
        device_model: '',
        os: 'macOS',
        app_version: '10.7.0',
        client_type: 'web',
        ip_address: '1.1.1.1',
        last_active_at: new Date().toISOString(),
        is_current: true,
        has_active_websocket: true,
      },
      {
        _id: 'sess-2',
        kratos_identity_id: 'id-1',
        kratos_session_id: 'ks-2',
        device_name: 'Other',
        device_model: '',
        os: 'iOS',
        app_version: '10.6.0',
        client_type: 'mobile',
        ip_address: '2.2.2.2',
        last_active_at: new Date().toISOString(),
        is_current: false,
        has_active_websocket: false,
      },
    ];

    mockMutate.mockResolvedValueOnce({
      data: { getMyActiveSessions: mockSessions },
    });

    const ActiveSessionsPage = (await import(
      '../app/[domain]/(default)/settings/security/sessions/page'
    )).default;

    await act(async () => {
      render(<ActiveSessionsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Log Out of All Other Devices')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Log Out of All Other Devices'));
    });

    // The modal.open should have been called with the StepUpVerificationModal
    expect(mockModalOpen).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// Test Suite 4: useLogout disposes WS client before clearing state
// ============================================================
describe('useLogout WS dispose', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispose() is called before local state is cleared', async () => {
    const callOrder: string[] = [];
    const mockDisposeCtx = vi.fn(() => callOrder.push('dispose'));
    const mockLocalStorageClear = vi.fn(() => callOrder.push('localStorage.clear'));

    vi.stubGlobal('localStorage', {
      clear: mockLocalStorageClear,
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    });

    // We test the ordering by verifying dispose is called before localStorage.clear
    // Since useLogout uses useContext for the dispose function, we need to render in the context
    const { GraphQLWSContext } = await import('$lib/graphql/subscription/context');
    const { useRawLogout } = await import('$lib/hooks/useLogout');

    function TestComponent() {
      const rawLogout = useRawLogout();
      return (
        <button data-testid="logout-btn" onClick={() => rawLogout()}>
          Logout
        </button>
      );
    }

    await act(async () => {
      render(
        <GraphQLWSContext.Provider value={{ client: null, dispose: mockDisposeCtx }}>
          <TestComponent />
        </GraphQLWSContext.Provider>,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    await waitFor(() => {
      expect(mockDisposeCtx).toHaveBeenCalled();
      expect(mockLocalStorageClear).toHaveBeenCalled();
      // dispose must come before localStorage.clear
      const disposeIdx = callOrder.indexOf('dispose');
      const clearIdx = callOrder.indexOf('localStorage.clear');
      expect(disposeIdx).toBeLessThan(clearIdx);
    });
  });
});
