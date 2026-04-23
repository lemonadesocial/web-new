'use client';

import React from 'react';

import { Button, Card, modal, ModalContent, toast } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { copy } from '$lib/utils/helpers';
import { normalizeHostname } from '$lib/utils/hostname';

import {
  HostnameVerificationInstructions,
  RequestHostnameVerificationDocument,
  VerifyHostnameDocument,
} from '../hostname-verification/graphql';
import { isChallengeRerolledError } from '../hostname-verification/errors';

type Phase = 'idle' | 'checking' | 'success' | 'failure' | 'rerolled';

type Props = {
  spaceId: string;
  hostname: string;
  instructions: HostnameVerificationInstructions;
  onVerified?: () => void;
};

const MODAL_TITLE_ID = 'hostname-verification-modal-title';

export function HostnameVerificationModal({ spaceId, hostname, instructions: initial, onVerified }: Props) {
  const normalizedHostname = React.useMemo(() => normalizeHostname(hostname), [hostname]);
  const [instructions, setInstructions] = React.useState(initial);
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [rerollMessage, setRerollMessage] = React.useState<string | null>(null);
  const [copyAnnouncement, setCopyAnnouncement] = React.useState<string>('');
  const verifyButtonWrapperRef = React.useRef<HTMLDivElement>(null);

  const [requestVerification] = useMutation(RequestHostnameVerificationDocument);
  const [verifyHostname] = useMutation(VerifyHostnameDocument);

  const handleCopy = (label: string, value: string) => {
    copy(value, () => {
      toast.success('Copied to clipboard');
      setCopyAnnouncement(`Copied ${label}`);
      window.setTimeout(() => setCopyAnnouncement(''), 1500);
    });
  };

  const runVerify = React.useCallback(async () => {
    setPhase('checking');
    setErrorMessage(null);

    const { data, error } = await verifyHostname({
      variables: { space_id: spaceId, hostname: normalizedHostname },
    });

    if (error) {
      if (isChallengeRerolledError(error)) {
        const refreshed = await requestVerification({
          variables: { space_id: spaceId, hostname: normalizedHostname },
        });
        if (refreshed.data?.requestHostnameVerification) {
          setInstructions(refreshed.data.requestHostnameVerification);
          setRerollMessage(
            'The verification token was refreshed. Please copy the new token and try again.',
          );
          setPhase('rerolled');
          return;
        }
      }

      const message = (error as { message?: string }).message ?? 'Unable to verify hostname.';
      setErrorMessage(message);
      setPhase('failure');
      return;
    }

    const entry = data?.verifyHostname;
    if (entry?.verified) {
      setPhase('success');
      onVerified?.();
      return;
    }

    setErrorMessage(
      entry?.last_check_error ?? 'The TXT record was not found. DNS may still be propagating.',
    );
    setPhase('failure');
  }, [normalizedHostname, onVerified, requestVerification, spaceId, verifyHostname]);

  // MEDIUM #1: Auto-close is scoped to a useEffect so its timer is cancelled
  // on unmount. Previously the timer could fire against a stale component
  // and call `modal.close()` for a modal that had already been dismissed.
  React.useEffect(() => {
    if (phase !== 'success') return;
    const id = window.setTimeout(() => {
      modal.close();
    }, 2000);
    return () => {
      window.clearTimeout(id);
    };
  }, [phase]);

  // MEDIUM #2.4: focus the primary action on initial render so keyboard
  // users land on "Verify now" without needing to tab past the close button.
  // The core Button component doesn't forward refs, so we reach through a
  // wrapper div to the child button element.
  React.useEffect(() => {
    const button = verifyButtonWrapperRef.current?.querySelector('button');
    button?.focus();
  }, []);

  return (
    <div role="group" aria-labelledby={MODAL_TITLE_ID}>
      <ModalContent
        title={<span id={MODAL_TITLE_ID}>Verify Custom Domain</span>}
        onClose={() => modal.close()}
        className="w-120 max-w-full"
      >
        <div className="flex flex-col gap-4">
          {/* MEDIUM #2.3: polite live region for async DNS check status. */}
          <div role="status" aria-live="polite" className="sr-only">
            {phase === 'checking' && 'Checking DNS record, please wait…'}
            {copyAnnouncement}
          </div>

          {/* HIGH #4: reroll advisory lives ABOVE step 1 so the user sees it
              in the same region they just re-read their updated token. It
              uses warning styling (not danger) and role="status" (not
              role="alert") because it isn't a DNS failure — the backend
              automatically refreshed the instructions and the user just
              needs to re-copy and re-click. */}
          {phase === 'rerolled' && rerollMessage && (
            <div
              className="flex items-start gap-2 text-warning-400"
              data-testid="verify-rerolled"
              role="status"
            >
              <i aria-hidden="true" className="icon-alert-circle size-5 shrink-0" />
              <p className="text-sm">{rerollMessage}</p>
            </div>
          )}

          <p className="text-sm text-secondary">
            Verify that you own{' '}
            <span className="text-primary font-medium">{hostname}</span>. Until this domain is
            verified, browser apps served from it will be blocked from talking to Lemonade.
          </p>

          <StepCard step={1} title="Add this TXT record at your DNS provider">
            <DnsRow
              label="Name"
              value={instructions.txt_record_name}
              onCopy={() => handleCopy('Name', instructions.txt_record_name)}
            />
            <DnsRow
              label="Value"
              value={instructions.txt_record_value}
              onCopy={() => handleCopy('Value', instructions.txt_record_value)}
            />
          </StepCard>

          <StepCard step={2} title="Then click verify below">
            <p className="text-sm text-secondary">
              DNS propagation can take a few minutes. We&apos;ll look up the TXT record on{' '}
              <span className="text-primary font-mono text-xs break-all">
                {instructions.txt_record_name}
              </span>
              .
            </p>

            {phase === 'success' && (
              <div
                className="flex items-center gap-2 text-success-400"
                data-testid="verify-success"
                role="status"
              >
                <i aria-hidden="true" className="icon-check-filled size-5" />
                <p className="text-sm">Verified! Closing…</p>
              </div>
            )}

            {phase === 'failure' && errorMessage && (
              <div
                className="flex items-start gap-2 text-danger-400"
                data-testid="verify-error"
                role="alert"
              >
                <i aria-hidden="true" className="icon-alert-circle size-5 shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="tertiary-alt" onClick={() => modal.close()}>
                Cancel
              </Button>
              <div ref={verifyButtonWrapperRef} className="contents">
                <Button
                  variant="secondary"
                  onClick={runVerify}
                  loading={phase === 'checking'}
                  disabled={phase === 'checking' || phase === 'success'}
                >
                  {phase === 'failure' || phase === 'rerolled'
                    ? 'Try again'
                    : phase === 'success'
                      ? 'Verified'
                      : 'Verify now'}
                </Button>
              </div>
            </div>
          </StepCard>
        </div>
      </ModalContent>
    </div>
  );
}

function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card.Root>
      <Card.Content className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex items-center justify-center size-6 rounded-full bg-primary/12 text-xs font-medium text-primary"
          >
            {step}
          </span>
          {/* MEDIUM #2.2: step titles are promoted to headings so screen-
              reader users can navigate the modal by heading level. */}
          <h3 className="font-medium text-base">{title}</h3>
        </div>
        {children}
      </Card.Content>
    </Card.Root>
  );
}

function DnsRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-sm bg-card px-3 py-2">
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-xs text-tertiary">{label}</p>
        <p className="text-sm font-mono truncate" title={value}>
          {value}
        </p>
      </div>
      <Button
        size="sm"
        variant="tertiary-alt"
        icon="icon-copy"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
      />
    </div>
  );
}
