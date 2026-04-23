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

  // Order matters: RequestHostnameVerificationDocument is registered first in
  // the modal component, VerifyHostnameDocument second.
  (useMutation as unknown as ReturnType<typeof vi.fn>)
    .mockReturnValueOnce([requestFn, { loading: false }])
    .mockReturnValueOnce([verifyFn, { loading: false }]);

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

  it('shows a loading state while the verify mutation is in flight', async () => {
    let resolveVerify!: (r: any) => void;
    const verifyFn = vi.fn(
      () => new Promise((resolve) => {
        resolveVerify = resolve;
      }),
    );
    const requestFn = vi.fn();
    (useMutation as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce([requestFn, { loading: false }])
      .mockReturnValueOnce([verifyFn, { loading: false }]);

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

    act(() => {
      resolveVerify({
        data: { verifyHostname: { ...instructions, verified: true } },
        error: null,
      });
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

    // The modal schedules modal.close() for 2000ms after success. Rather than
    // fake timers (which conflict with waitFor), assert the schedule + invoke
    // the callback directly.
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

  it('handles the 409 concurrent-reroll error by refetching instructions and updating copy', async () => {
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
      expect(screen.getByTestId('verify-error').textContent).toContain('verification token was refreshed');
    });

    expect(verifyFn).toHaveBeenCalledTimes(1);
    expect(requestFn).toHaveBeenCalledTimes(1);
    // New challenge token is rendered on the TXT record value row.
    expect(screen.getByText('tok_xyz_999')).toBeDefined();
  });
});
