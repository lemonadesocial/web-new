'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, modal, toast } from '$lib/components/core';
import { ModalContent } from '$lib/components/core/dialog/modal';
import { useMutation } from '$lib/graphql/request';
import { getErrorMessage } from '$lib/utils/error';
import {
  ActiveSessionFieldsFragmentDoc,
  GetMyActiveSessionsDocument,
  RevokeMySessionDocument,
  RequestStepUpVerificationDocument,
  VerifyStepUpVerificationDocument,
  RevokeAllOtherSessionsDocument,
  type ActiveSessionFieldsFragment,
} from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';

type ActiveSession = ActiveSessionFieldsFragment;

// ---- Relative time helper ----
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ---- Step-Up Verification Modal ----
function StepUpVerificationModal({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [code, setCode] = useState('');
  const [requestCode] = useMutation(RequestStepUpVerificationDocument);
  const [verifyCode] = useMutation(VerifyStepUpVerificationDocument);
  const [revokeAll] = useMutation(RevokeAllOtherSessionsDocument);
  const [step, setStep] = useState<'request' | 'verify' | 'done'>('request');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = useCallback(async () => {
    setLoading(true);
    try {
      await requestCode({});
      setStep('verify');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [requestCode]);

  const handleVerifyAndRevoke = useCallback(async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const { data } = await verifyCode({ variables: { code } });
      const token = data?.verifyStepUpVerification;
      if (!token) {
        toast.error('Verification failed');
        setLoading(false);
        return;
      }
      await revokeAll({ variables: { stepUpToken: token } });
      setStep('done');
      toast.success('All other sessions have been revoked');
      onSuccess(token);
      modal.close();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [code, verifyCode, revokeAll, onSuccess]);

  return (
    <ModalContent
      title="Log Out All Other Devices"
      icon="icon-shield"
      onClose={() => modal.close()}
    >
      {step === 'request' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">
            A verification code will be sent to your email. Enter it to confirm revoking all other sessions.
          </p>
          <Button loading={loading} onClick={handleRequestCode}>
            Send Verification Code
          </Button>
        </div>
      )}
      {step === 'verify' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">
            Enter the 6-digit code sent to your email.
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-3 py-2 rounded-lg bg-overlay-primary border border-card-border text-center text-xl tracking-widest font-mono text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            autoFocus
            data-testid="step-up-code-input"
          />
          <Button loading={loading} onClick={handleVerifyAndRevoke} disabled={code.length !== 6}>
            Verify & Revoke Sessions
          </Button>
        </div>
      )}
    </ModalContent>
  );
}

// ---- Session Row ----
function SessionRow({
  session,
  onRevoke,
}: {
  session: ActiveSession;
  onRevoke: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [revoking, setRevoking] = useState(false);

  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={() => setExpanded((prev) => !prev)}
      data-testid="session-row"
    >
      <div className="flex items-center gap-4 px-4 py-3">
        <i
          aria-hidden="true"
          className="icon-smartphone size-5 text-tertiary"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-primary font-medium truncate">
              {session.device_name || 'Unknown Device'}
            </p>
            {session.is_current && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/16 text-accent font-medium">
                Current
              </span>
            )}
            {session.has_active_websocket && (
              <span className="size-2 rounded-full bg-success-400 shrink-0" title="Active connection" />
            )}
          </div>
          <p className="text-sm text-tertiary truncate">
            {[session.os, session.app_version].filter(Boolean).join(' · ')}
            {session.last_active_at && ` · ${relativeTime(session.last_active_at)}`}
          </p>
        </div>
        {!session.is_current && (
          <Button
            variant="danger"
            size="sm"
            loading={revoking}
            onClick={async (e) => {
              e.stopPropagation();
              setRevoking(true);
              try {
                await onRevoke(session._id);
              } finally {
                setRevoking(false);
              }
            }}
            data-testid="revoke-button"
          >
            Revoke
          </Button>
        )}
      </div>
      {expanded && (
        <div className="px-4 pb-3 pl-13">
          <p className="text-xs text-tertiary">
            IP: {session.ip_address || 'Unknown'}
          </p>
          {session.device_model && (
            <p className="text-xs text-tertiary">
              Model: {session.device_model}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Main Page ----
export default function ActiveSessionsPage() {
  const router = useRouter();
  const [fetchSessions] = useMutation(GetMyActiveSessionsDocument);
  const [revokeSession] = useMutation(RevokeMySessionDocument);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Re-render every 60s so relativeTime() values stay fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchSessions({});
      if (data?.getMyActiveSessions) {
        setSessions(useFragment(ActiveSessionFieldsFragmentDoc, data.getMyActiveSessions));
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleRevoke = useCallback(
    async (sessionId: string) => {
      try {
        await revokeSession({ variables: { sessionId } });
        setSessions((prev) => prev.filter((s) => s._id !== sessionId));
        toast.success('Session revoked');
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      }
    },
    [revokeSession],
  );

  const handleRevokeAll = useCallback(() => {
    modal.open(StepUpVerificationModal, {
      props: {
        onSuccess: () => {
          loadSessions();
        },
      },
    });
  }, [loadSessions]);

  return (
    <div className="flex flex-col gap-6 mt-6 pb-24 md:my-11 max-w-133">
      <div className="flex items-center gap-3">
        <Button
          icon="icon-chevron-left"
          size="xs"
          variant="tertiary"
          className="rounded-full"
          onClick={() => router.back()}
        />
        <div>
          <h1 className="text-xl font-semibold text-primary">Active Sessions</h1>
          <p className="text-sm text-tertiary">Manage devices signed in to your account</p>
        </div>
      </div>

      <div className="bg-card backdrop-blur-lg rounded-lg border border-card-border flex flex-col divide-y divide-(--color-divider)">
        {loading && sessions.length === 0 ? (
          <div className="px-4 py-8 text-center text-tertiary">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="px-4 py-8 text-center text-tertiary">No active sessions found</div>
        ) : (
          sessions.map((session) => (
            <SessionRow key={session._id} session={session} onRevoke={handleRevoke} />
          ))
        )}
      </div>

      {sessions.length > 1 && (
        <Button variant="danger" onClick={handleRevokeAll}>
          Log Out of All Other Devices
        </Button>
      )}
    </div>
  );
}
