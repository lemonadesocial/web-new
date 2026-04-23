import { expect, it, describe, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

import { HostnameVerificationModal } from '$lib/components/features/community-manage/modals/HostnameVerificationModal';
import type { HostnameVerificationInstructions } from '$lib/components/features/community-manage/hostname-verification/graphql';
import { useMutation } from '$lib/graphql/request';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const { modalClose, toastSuccess, toastError, copyMock } = vi.hoisted(() => ({
  modalClose: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  copyMock: vi.fn((_text: string, cb?: () => void) => cb?.()),
}));

vi.mock('$lib/graphql/request', () => ({
  useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
  useQuery: vi.fn(() => ({ data: null, loading: false, refetch: vi.fn() })),
}));

vi.mock('$lib/utils/helpers', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    copy: (text: string, cb?: () => void) => copyMock(text, cb),
  };
});

vi.mock('$lib/components/core', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    modal: { open: vi.fn(), close: modalClose },
    toast: { success: toastSuccess, error: toastError },
    Button: ({ children, onClick, loading, disabled, 'aria-label': ariaLabel }: any) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        data-loading={loading ? 'true' : undefined}
      >
        {children}
      </button>
    ),
    ModalContent: ({ children, title, onClose }: any) => (
      <div role="dialog" aria-label={typeof title === 'string' ? title : undefined}>
        {title && <p>{title}</p>}
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close">
            close
          </button>
        )}
        <div>{children}</div>
      </div>
    ),
    Card: {
      Root: ({ children }: any) => <div>{children}</div>,
      Content: ({ children }: any) => <div>{children}</div>,
    },
  };
});

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

const instructions: HostnameVerificationInstructions = {
  __typename: 'HostnameVerificationInstructions',
  hostname: 'events.example.com',
  challenge_token: 'tok_abc_123',
  txt_record_name: '_lemonade-challenge.events.example.com',
  txt_record_value: 'tok_abc_123',
  verified: false,
};

const freshInstructions: HostnameVerificationInstructions = {
  ...instructions,
  challenge_token: 'tok_xyz_999',
  txt_record_value: 'tok_xyz_999',
};

// NIT #2: Look mocks up by document name instead of relying on registration
// order. The modal calls `useMutation(RequestHostnameVerificationDocument)`
// first and `useMutation(VerifyHostnameDocument)` second today, but if that
// ever changes (reordered imports, new intermediate mutation, etc.) the
// previous mockReturnValueOnce chain would silently swap the mocks and
// produce confusing test failures.
function setupMutations({
  verifyResult,
  requestResult,
}: {
  verifyResult: { data?: any; error?: any };
  requestResult?: { data?: any; error?: any };
}) {
  const verifyFn = vi.fn().mockResolvedValue(verifyResult);
  const requestFn = vi
    .fn()
    .mockResolvedValue(requestResult ?? { data: { requestHostnameVerification: freshInstructions }, error: null });

  (useMutation as unknown as ReturnType<typeof vi.fn>).mockImplementation((doc: any) => {
    const name = doc?.definitions?.[0]?.name?.value;
    if (name === 'RequestHostnameVerification') return [requestFn, { loading: false }];
    if (name === 'VerifyHostname') return [verifyFn, { loading: false }];
    throw new Error(`unexpected document passed to useMutation: ${name}`);
  });

  return { verifyFn, requestFn };
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('HostnameVerificationModal', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders step 1 with TXT record name and value', () => {
    setupMutations({ verifyResult: { data: null, error: null } });

    render(
      <HostnameVerificationModal
        spaceId="space-1"
        hostname="events.example.com"
        instructions={instructions}
      />,
    );

    // Name appears both in the step-1 row and in the step-2 copy; both are
    // intentional so we just assert it renders at least once.
    expect(screen.getAllByText('_lemonade-challenge.events.example.com').length).toBeGreaterThan(0);
    expect(screen.getByText('tok_abc_123')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Verify now' })).toBeDefined();
  });

  it('copies the TXT record name and value when the copy buttons are clicked', () => {
    setupMutations({ verifyResult: { data: null, error: null } });

    render(
      <HostnameVerificationModal
        spaceId="space-1"
        hostname="events.example.com"
        instructions={instructions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy Name' }));
    expect(copyMock).toHaveBeenCalledWith(
      '_lemonade-challenge.events.example.com',
      expect.any(Function),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy Value' }));
    expect(copyMock).toHaveBeenCalledWith('tok_abc_123', expect.any(Function));

    expect(toastSuccess).toHaveBeenCalledTimes(2);
  });

  it('shows a loading state while the verify mutation is in flight, then transitions to success', async () => {
    let resolveVerify!: (r: any) => void;
    const verifyFn = vi.fn(
      () => new Promise((resolve) => {
        resolveVerify = resolve;
      }),
    );
    const requestFn = vi.fn();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockImplementation((doc: any) => {
      const name = doc?.definitions?.[0]?.name?.value;
      if (name === 'RequestHostnameVerification') return [requestFn, { loading: false }];
      if (name === 'VerifyHostname') return [verifyFn, { loading: false }];
      throw new Error(`unexpected document: ${name}`);
    });

    render(
      <HostnameVerificationModal
        spaceId="space-1"
        hostname="events.example.com"
        instructions={instructions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Verify now' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Verify now' }).getAttribute('data-loading')).toBe('true');
    });

    await act(async () => {
      resolveVerify({
        data: { verifyHostname: { ...instructions, verified: true } },
        error: null,
      });
    });

    // NIT #3: assert the loading → success transition actually completes so
    // this test isn't just checking loading and hanging on a dangling
    // promise.
    await waitFor(() => {
      expect(screen.getByTestId('verify-success')).toBeDefined();
    });
  });

  it('shows a success state and auto-closes after 2s when verification succeeds', async () => {
    setupMutations({
      verifyResult: {
        data: { verifyHostname: { ...instructions, verified: true, verified_at: '2026-04-23T00:00:00Z' } },
        error: null,
      },
    });

    const onVerified = vi.fn();
    render(
      <HostnameVerificationModal
        spaceId="space-1"
        hostname="events.example.com"
        instructions={instructions}
        onVerified={onVerified}
      />,
    );

    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    fireEvent.click(screen.getByRole('button', { name: 'Verify now' }));

    await waitFor(() => {
      expect(screen.getByTestId('verify-success')).toBeDefined();
    });
    expect(onVerified).toHaveBeenCalledTimes(1);

    // The modal schedules modal.close() for 2000ms after success via a
    // useEffect. Rather than fake timers (which conflict with waitFor),
    // assert the schedule + invoke the callback directly.
    const call = setTimeoutSpy.mock.calls.find(([, delay]) => delay === 2000);
    expect(call).toBeDefined();
    (call![0] as () => void)();
    expect(modalClose).toHaveBeenCalledTimes(1);
  });

  it('shows the DNS failure message and keeps the modal open for retry', async () => {
    setupMutations({
      verifyResult: {
        data: { verifyHostname: { ...instructions, verified: false, last_check_error: 'TXT record not found' } },
        error: null,
      },
    });

    render(
      <HostnameVerificationModal
        spaceId="space-1"
        hostname="events.example.com"
        instructions={instructions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Verify now' }));

    await waitFor(() => {
      expect(screen.getByTestId('verify-error').textContent).toContain('TXT record not found');
    });
    expect(screen.getByRole('button', { name: 'Try again' })).toBeDefined();
    expect(modalClose).not.toHaveBeenCalled();
  });

  it('handles the 409 concurrent-reroll error via extensions.code and renders a warning-tone advisory', async () => {
    const { verifyFn, requestFn } = setupMutations({
      // HIGH #3: primary detection is via `extensions.code`, plumbed through
      // the shared client as `error.code`.
      verifyResult: {
        data: null,
        error: { message: 'hostname challenge changed concurrently, retry requestHostnameVerification', code: 'CONFLICT' },
      },
      requestResult: { data: { requestHostnameVerification: freshInstructions }, error: null },
    });

    render(
      <HostnameVerificationModal
        spaceId="space-1"
        hostname="events.example.com"
        instructions={instructions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Verify now' }));

    // HIGH #4: reroll renders in its OWN testid with role="status" (not the
    // red DNS-failure role="alert").
    await waitFor(() => {
      expect(screen.getByTestId('verify-rerolled').textContent).toContain('verification token was refreshed');
    });
    expect(screen.queryByTestId('verify-error')).toBeNull();

    expect(verifyFn).toHaveBeenCalledTimes(1);
    expect(requestFn).toHaveBeenCalledTimes(1);
    // New challenge token is rendered on the TXT record value row.
    expect(screen.getByText('tok_xyz_999')).toBeDefined();

    // Clicking Try again sends the user back through idle → checking.
    expect(screen.getByRole('button', { name: 'Try again' })).toBeDefined();
  });

  it('still detects the 409 concurrent-reroll error via the legacy message-only shape', async () => {
    // HIGH #3 fallback path: some error paths may not plumb
    // `extensions.code` through. The regex fallback on message text must
    // continue to catch the rename case.
    const { verifyFn, requestFn } = setupMutations({
      verifyResult: {
        data: null,
        error: { message: 'hostname challenge changed concurrently, retry requestHostnameVerification' },
      },
      requestResult: { data: { requestHostnameVerification: freshInstructions }, error: null },
    });

    render(
      <HostnameVerificationModal
        spaceId="space-1"
        hostname="events.example.com"
        instructions={instructions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Verify now' }));

    await waitFor(() => {
      expect(screen.getByTestId('verify-rerolled').textContent).toContain('verification token was refreshed');
    });
    expect(verifyFn).toHaveBeenCalledTimes(1);
    expect(requestFn).toHaveBeenCalledTimes(1);
  });
});
