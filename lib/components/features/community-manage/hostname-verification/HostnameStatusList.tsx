'use client';

import React from 'react';

import { Button, Card, modal, toast } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import { isCustomHostname, normalizeHostname } from '$lib/utils/hostname';

import { ConfirmModal } from '../../modals/ConfirmModal';
import { HostnameVerificationModal } from '../modals/HostnameVerificationModal';
import {
  GetSpaceHostnameEntriesDocument,
  RequestHostnameVerificationDocument,
  WhitelabelHostname,
} from './graphql';
import { getRequestVerificationErrorMessage } from './errors';

type Props = {
  spaceId: string;
};

export function HostnameStatusList({ spaceId }: Props) {
  const { data, loading, refetch } = useQuery(GetSpaceHostnameEntriesDocument, {
    variables: { id: spaceId },
    fetchPolicy: 'cache-and-network',
  });

  const [requestVerification, { loading: requesting }] = useMutation(
    RequestHostnameVerificationDocument,
  );

  const entries = React.useMemo(() => {
    const all = data?.getSpace?.hostname_entries ?? [];
    // Filter out the built-in lemonade.social hostname — tenants only care about
    // their custom domains. Matches the filter applied to the visible list above.
    return all.filter((e) => isCustomHostname(e.hostname));
  }, [data]);

  const [pendingHostname, setPendingHostname] = React.useState<string | null>(null);

  // Opens the verification modal for any hostname. Extracted so both the
  // unverified flow (direct call) and the verified flow (gated behind a
  // confirmation modal) can share the same implementation.
  const runVerifyFlow = React.useCallback(
    async (hostname: string) => {
      // HIGH #5: prevent parallel requests. If we're already mid-request
      // for another hostname, early-return. Individual Verify/Re-verify
      // buttons are also disabled via the `busy` prop below, but this is
      // a belt-and-braces guard against rapid clicks slipping through
      // React batching.
      if (pendingHostname) return;

      const normalized = normalizeHostname(hostname);
      setPendingHostname(hostname);
      const { data: res, error } = await requestVerification({
        variables: { space_id: spaceId, hostname: normalized },
      });
      setPendingHostname(null);

      if (error || !res?.requestHostnameVerification) {
        toast.error(getRequestVerificationErrorMessage(error));
        return;
      }

      modal.open(HostnameVerificationModal, {
        props: {
          spaceId,
          hostname,
          instructions: res.requestHostnameVerification,
        },
        dismissible: true,
        // HIGH #2: single refetch — `onClose` fires on dismiss, cancel, and
        // the 2s auto-close after success. The previous `onVerified` +
        // `onClose` combo double-fetched on every successful verification.
        onClose: () => refetch(),
      });
    },
    [pendingHostname, refetch, requestVerification, spaceId],
  );

  const openVerifyModal = React.useCallback(
    (hostname: string, alreadyVerified: boolean) => {
      if (pendingHostname) return;

      if (!alreadyVerified) {
        void runVerifyFlow(hostname);
        return;
      }

      // BLOCKER #2: Re-verify on a currently-verified hostname would re-roll
      // the challenge token and immediately unverify the domain (pausing its
      // CORS access) until DNS propagates the new TXT record. Require an
      // explicit confirmation before taking that destructive action.
      //
      // NF-1: ConfirmModal's click handler calls `modal.close()` after the
      // awaited `onConfirm`. If we opened the HostnameVerificationModal from
      // inside `onConfirm`, ConfirmModal's trailing `modal.close()` would pop
      // the TOP of the stack — which by then is the Verify modal — leaving
      // the user stuck with the now-useless Confirm modal while the backend
      // has already rolled the challenge token. Instead, set a `confirmed`
      // flag in `onConfirm` and open Verify from `onClose`, deferred via
      // setTimeout so the ConfirmModal's state-pop commits before we push
      // the Verify modal onto a clean stack.
      let confirmed = false;
      modal.open(ConfirmModal, {
        props: {
          title: 'Re-verify custom domain?',
          subtitle:
            'Re-verifying will generate a new TXT record. Your current verification stays active until you update DNS. The domain will be unverified (and its CORS access paused) from the moment you click until the new record is live.',
          icon: 'icon-alert-circle',
          buttonText: 'Generate new record',
          onConfirm: () => {
            confirmed = true;
          },
        },
        onClose: () => {
          if (!confirmed) return;
          window.setTimeout(() => {
            void runVerifyFlow(hostname);
          }, 0);
        },
      });
    },
    [pendingHostname, runVerifyFlow],
  );

  if (loading && entries.length === 0) return null;
  if (entries.length === 0) return null;

  const globalBusy = Boolean(pendingHostname);

  return (
    <Card.Root>
      <Card.Content className="p-0 divide-y divide-(--color-divider)">
        {entries.map((entry) => (
          <HostnameRow
            key={entry.hostname}
            entry={entry}
            busy={requesting && pendingHostname === entry.hostname}
            disabled={globalBusy && pendingHostname !== entry.hostname}
            onVerify={() => openVerifyModal(entry.hostname, entry.verified)}
          />
        ))}
      </Card.Content>
    </Card.Root>
  );
}

function HostnameRow({
  entry,
  busy,
  disabled,
  onVerify,
}: {
  entry: WhitelabelHostname;
  busy: boolean;
  disabled: boolean;
  onVerify: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="truncate" title={entry.hostname}>
          {entry.hostname}
        </p>
        <VerificationBadge entry={entry} />
      </div>
      {entry.verified ? (
        <button
          type="button"
          className="text-sm text-secondary hover:text-primary underline-offset-2 hover:underline disabled:opacity-50"
          onClick={onVerify}
          disabled={busy || disabled}
          aria-label={`Re-verify ${entry.hostname}`}
        >
          Re-verify
        </button>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          onClick={onVerify}
          loading={busy}
          disabled={disabled}
        >
          Verify
        </Button>
      )}
    </div>
  );
}

function VerificationBadge({ entry }: { entry: WhitelabelHostname }) {
  if (entry.verified) {
    return (
      <div
        className="flex items-center gap-1 text-xs text-success-400"
        data-testid="hostname-badge-verified"
      >
        <i aria-hidden="true" className="icon-check-filled size-3.5" />
        <span>Verified</span>
      </div>
    );
  }

  const message = entry.last_check_error
    ? `Unverified — ${entry.last_check_error}`
    : 'Unverified — add the DNS TXT record to complete setup';

  return (
    <div
      className="flex items-center gap-1 text-xs text-warning-400"
      data-testid="hostname-badge-unverified"
    >
      <i aria-hidden="true" className="icon-alert-circle size-3.5" />
      <span className="truncate" title={message}>
        {message}
      </span>
    </div>
  );
}
