'use client';

import React from 'react';

import { Button, Card, modal, ModalContent, toast } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { copy } from '$lib/utils/helpers';

import {
  HostnameVerificationInstructions,
  RequestHostnameVerificationDocument,
  VerifyHostnameDocument,
  isChallengeRerolledError,
} from '../hostname-verification/graphql';

type Phase = 'idle' | 'checking' | 'success' | 'failure';

type Props = {
  spaceId: string;
  hostname: string;
  instructions: HostnameVerificationInstructions;
  onVerified?: () => void;
};

export function HostnameVerificationModal({ spaceId, hostname, instructions: initial, onVerified }: Props) {
  const [instructions, setInstructions] = React.useState(initial);
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [requestVerification] = useMutation(RequestHostnameVerificationDocument);
  const [verifyHostname] = useMutation(VerifyHostnameDocument);

  const handleCopy = (value: string) => copy(value, () => toast.success('Copied to clipboard'));

  const runVerify = React.useCallback(async () => {
    setPhase('checking');
    setErrorMessage(null);

    const { data, error } = await verifyHostname({
      variables: { space_id: spaceId, hostname },
    });

    if (!mounted.current) return;

    if (error) {
      if (isChallengeRerolledError(error)) {
        const refreshed = await requestVerification({
          variables: { space_id: spaceId, hostname },
        });
        if (!mounted.current) return;
        if (refreshed.data?.requestHostnameVerification) {
          setInstructions(refreshed.data.requestHostnameVerification);
          setErrorMessage(
            'The verification token was refreshed. Please copy the new token and try again.',
          );
          setPhase('failure');
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
      window.setTimeout(() => {
        if (mounted.current) modal.close();
      }, 2000);
      return;
    }

    setErrorMessage(
      entry?.last_check_error ?? 'The TXT record was not found. DNS may still be propagating.',
    );
    setPhase('failure');
  }, [hostname, onVerified, requestVerification, spaceId, verifyHostname]);

  return (
    <ModalContent
      title="Verify Custom Domain"
      onClose={() => modal.close()}
      className="w-120 max-w-full"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-secondary">
          Verify that you own{' '}
          <span className="text-primary font-medium">{hostname}</span>. Until this domain is
          verified, browser apps served from it will be blocked from talking to Lemonade.
        </p>

        <StepCard step={1} title="Add this TXT record at your DNS provider">
          <DnsRow
            label="Name"
            value={instructions.txt_record_name}
            onCopy={() => handleCopy(instructions.txt_record_name)}
          />
          <DnsRow
            label="Value"
            value={instructions.txt_record_value}
            onCopy={() => handleCopy(instructions.txt_record_value)}
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
            <Button
              variant="secondary"
              onClick={runVerify}
              loading={phase === 'checking'}
              disabled={phase === 'checking' || phase === 'success'}
            >
              {phase === 'failure' ? 'Try again' : phase === 'success' ? 'Verified' : 'Verify now'}
            </Button>
          </div>
        </StepCard>
      </div>
    </ModalContent>
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
          <p className="font-medium">{title}</p>
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
