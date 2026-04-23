'use client';

import React from 'react';

import { Button, Card, modal, toast } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';

import { HostnameVerificationModal } from '../modals/HostnameVerificationModal';
import {
  GetSpaceHostnameEntriesDocument,
  RequestHostnameVerificationDocument,
  WhitelabelHostname,
} from './graphql';

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
    return all.filter((e) => !e.hostname.endsWith('lemonade.social'));
  }, [data]);

  const [pendingHostname, setPendingHostname] = React.useState<string | null>(null);

  const openVerifyModal = React.useCallback(
    async (hostname: string) => {
      setPendingHostname(hostname);
      const { data: res, error } = await requestVerification({
        variables: { space_id: spaceId, hostname },
      });
      setPendingHostname(null);

      if (error || !res?.requestHostnameVerification) {
        const message = (error as { message?: string } | null)?.message;
        toast.error(message ?? 'Could not start verification. Please try again.');
        return;
      }

      modal.open(HostnameVerificationModal, {
        props: {
          spaceId,
          hostname,
          instructions: res.requestHostnameVerification,
          onVerified: () => refetch(),
        },
        dismissible: true,
        onClose: () => refetch(),
      });
    },
    [refetch, requestVerification, spaceId],
  );

  if (loading && entries.length === 0) return null;
  if (entries.length === 0) return null;

  return (
    <Card.Root>
      <Card.Content className="p-0 divide-y divide-(--color-divider)">
        {entries.map((entry) => (
          <HostnameRow
            key={entry.hostname}
            entry={entry}
            busy={requesting && pendingHostname === entry.hostname}
            onVerify={() => openVerifyModal(entry.hostname)}
          />
        ))}
      </Card.Content>
    </Card.Root>
  );
}

function HostnameRow({
  entry,
  busy,
  onVerify,
}: {
  entry: WhitelabelHostname;
  busy: boolean;
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
          disabled={busy}
          aria-label={`Re-verify ${entry.hostname}`}
        >
          Re-verify
        </button>
      ) : (
        <Button size="sm" variant="secondary" onClick={onVerify} loading={busy}>
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
