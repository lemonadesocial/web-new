import { expect, it, describe, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { HostnameStatusList } from '$lib/components/features/community-manage/hostname-verification/HostnameStatusList';
import type { WhitelabelHostname } from '$lib/components/features/community-manage/hostname-verification/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const { modalOpen, toastError, toastSuccess } = vi.hoisted(() => ({
  modalOpen: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('$lib/graphql/request', () => ({
  useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
  useQuery: vi.fn(() => ({ data: null, loading: false, refetch: vi.fn() })),
}));

vi.mock('$lib/components/core', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    modal: { open: modalOpen, close: vi.fn() },
    toast: { success: toastSuccess, error: toastError },
    Button: ({ children, onClick, loading, disabled }: any) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        data-loading={loading ? 'true' : undefined}
      >
        {children}
      </button>
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

const unverifiedEntry: WhitelabelHostname = {
  __typename: 'WhitelabelHostname',
  hostname: 'a.example.com',
  verified: false,
  challenge_token: 'tok_a',
  verified_at: null,
  created_at: '2026-04-23T00:00:00Z',
  last_checked_at: null,
  last_check_error: null,
};

const unverifiedEntryB: WhitelabelHostname = {
  ...unverifiedEntry,
  hostname: 'b.example.com',
  challenge_token: 'tok_b',
};
const verifiedEntry: WhitelabelHostname = {
  ...unverifiedEntry,
  verified: true,
  verified_at: '2026-04-23T00:00:05Z',
  last_checked_at: '2026-04-23T00:00:05Z',
};

const instructionsA = {
  __typename: 'HostnameVerificationInstructions',
  hostname: 'a.example.com',
  challenge_token: 'tok_a',
  txt_record_name: '_lemonade-challenge.a.example.com',
  txt_record_value: 'tok_a',
  verified: false,
};

function setupQuery(entries: WhitelabelHostname[]) {
  (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    data: {
      __typename: 'Query',
      getSpace: {
        __typename: 'Space',
        _id: 'space-1',
        hostname_entries: entries,
      },
    },
    loading: false,
    refetch: vi.fn(),
  });
}

describe('HostnameStatusList', () => {
  beforeEach(() => {
    // Default mutation: resolves with successful request response.
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      vi.fn().mockResolvedValue({ data: { requestHostnameVerification: instructionsA }, error: null }),
      { loading: false },
    ]);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the Verify button for unverified hostnames and calls requestVerification when clicked', async () => {
    setupQuery([unverifiedEntry]);

    const requestFn = vi
      .fn()
      .mockResolvedValue({ data: { requestHostnameVerification: instructionsA }, error: null });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([requestFn, { loading: false }]);

    render(<HostnameStatusList spaceId="space-1" />);

    const btn = screen.getByRole('button', { name: 'Verify' });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(requestFn).toHaveBeenCalledWith({
        variables: { space_id: 'space-1', hostname: 'a.example.com' },
      });
    });

    // On success, it opens HostnameVerificationModal directly (no ConfirmModal).
    await waitFor(() => {
      expect(modalOpen).toHaveBeenCalledTimes(1);
    });
    const firstOpenCall = modalOpen.mock.calls[0];
    // The first arg is the Modal component; check it's NOT the ConfirmModal.
    expect((firstOpenCall[0] as any).name ?? (firstOpenCall[0] as any).displayName).toContain('HostnameVerificationModal');
  });

  it('normalizes the hostname before sending (MEDIUM #4)', async () => {
    setupQuery([{ ...unverifiedEntry, hostname: '  A.Example.Com  ' }]);

    const requestFn = vi
      .fn()
      .mockResolvedValue({ data: { requestHostnameVerification: instructionsA }, error: null });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([requestFn, { loading: false }]);

    render(<HostnameStatusList spaceId="space-1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => {
      expect(requestFn).toHaveBeenCalledWith({
        variables: { space_id: 'space-1', hostname: 'a.example.com' },
      });
    });
  });

  it('shows a ConfirmModal before re-verifying an already-verified hostname (BLOCKER #2)', async () => {
    setupQuery([verifiedEntry]);

    const requestFn = vi
      .fn()
      .mockResolvedValue({ data: { requestHostnameVerification: instructionsA }, error: null });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([requestFn, { loading: false }]);

    render(<HostnameStatusList spaceId="space-1" />);

    const reverifyBtn = screen.getByRole('button', { name: /re-verify/i });
    fireEvent.click(reverifyBtn);

    // No network call yet — must go through the confirm modal first.
    expect(requestFn).not.toHaveBeenCalled();
    expect(modalOpen).toHaveBeenCalledTimes(1);
    const [component, options] = modalOpen.mock.calls[0];
    expect((component as any).name ?? (component as any).displayName).toContain('ConfirmModal');
    expect((options as any).props.title).toMatch(/re-verify custom domain/i);
    expect((options as any).props.buttonText).toMatch(/generate new record/i);
  });

  it('surfaces actionable messaging when the backend reports "not found on space" (MEDIUM #3)', async () => {
    setupQuery([unverifiedEntry]);

    const requestFn = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'hostname not found on space', code: '404' },
    });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([requestFn, { loading: false }]);

    render(<HostnameStatusList spaceId="space-1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        expect.stringContaining("isn't saved to the space"),
      );
    });
    expect(modalOpen).not.toHaveBeenCalled();
  });

  it('does not fire a second request while another verify is still in flight (HIGH #5)', async () => {
    setupQuery([unverifiedEntry, unverifiedEntryB]);

    let resolveFirst: (v: unknown) => void = () => {};
    const requestFn = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFirst = resolve;
      });
    });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([requestFn, { loading: true }]);

    render(<HostnameStatusList spaceId="space-1" />);

    const buttons = screen.getAllByRole('button', { name: 'Verify' });
    fireEvent.click(buttons[0]);
    // Second click while the first is still pending — must NOT fire a
    // second mutation. The button is also disabled via `busy`/`disabled`
    // props, but we assert on the mock count to be certain.
    fireEvent.click(buttons[1]);

    expect(requestFn).toHaveBeenCalledTimes(1);

    // Drain the pending promise so we don't leak a rejection on unmount.
    resolveFirst({ data: { requestHostnameVerification: instructionsA }, error: null });
    await Promise.resolve();
  });
});
