'use client';

import React from 'react';
import { useAtomValue } from 'jotai';

import { Button } from '$lib/components/core';

import { aiDraftPhaseAtom, aiDraftErrorAtom } from '../store';
import type { AIDraftPhase } from '../store';
import { classifyError, type PBErrorClass } from '../observability';

// ── Props ──

interface AIDraftBannerProps {
  onApply: () => void;
  onRevert: () => void;
  onRetry: () => void;
  onDismissError: () => void;
}

// ── Helpers ──

function errorMessage(errorClass: PBErrorClass): string {
  if (errorClass === 'retryable') return 'AI edit failed — a temporary error occurred.';
  if (errorClass === 'user_fixable') return 'AI edit failed — please check your permissions or input.';
  return 'AI edit failed — an unexpected error occurred.';
}

// ── Component ──

export function AIDraftBanner({ onApply, onRevert, onRetry, onDismissError }: AIDraftBannerProps) {
  const phase = useAtomValue(aiDraftPhaseAtom);
  const draftError = useAtomValue(aiDraftErrorAtom);

  if (phase === 'idle') return null;

  if (phase === 'loading') {
    return (
      <BannerShell className="bg-purple-500/8 border-purple-500/20">
        <div className="flex items-center gap-2 min-w-0">
          <i className="icon-loading animate-spin size-4 text-purple-400 shrink-0" />
          <span className="text-primary truncate">AI is generating your changes...</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="tertiary-alt" size="xs" onClick={onRevert}>
            Cancel
          </Button>
        </div>
      </BannerShell>
    );
  }

  if (phase === 'previewing') {
    return (
      <BannerShell className="bg-green-500/8 border-green-500/20">
        <div className="flex items-center gap-2 min-w-0">
          <i className="icon-checkmark-circle size-4 text-green-400 shrink-0" />
          <span className="text-primary truncate">AI suggestion ready — review the preview below.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="tertiary-alt" size="xs" onClick={onRevert}>
            Revert
          </Button>
          <Button variant="primary" size="xs" onClick={onApply}>
            Apply Changes
          </Button>
        </div>
      </BannerShell>
    );
  }

  // phase === 'error'
  const ec = classifyError(draftError);
  const isFatal = ec === 'fatal';
  const isRetryable = ec === 'retryable';

  return (
    <BannerShell className={isFatal ? 'bg-red-500/8 border-red-500/20' : 'bg-amber-500/8 border-amber-500/20'}>
      <div className="flex items-center gap-2 min-w-0">
        <i className={`icon-warning size-4 shrink-0 ${isFatal ? 'text-red-400' : 'text-amber-400'}`} />
        <span className="text-primary truncate">{errorMessage(ec)}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isRetryable && (
          <Button variant="tertiary-alt" size="xs" onClick={onRetry}>
            Retry
          </Button>
        )}
        {isRetryable ? (
          <Button variant="tertiary-alt" size="xs" onClick={onRevert}>
            Revert
          </Button>
        ) : (
          <Button variant="tertiary-alt" size="xs" onClick={onDismissError}>
            Dismiss
          </Button>
        )}
      </div>
    </BannerShell>
  );
}

// ── Shell wrapper ──

function BannerShell({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={`border rounded-md text-sm px-4 py-2.5 ${className}`}>
      <div className="flex items-center justify-between gap-3">{children}</div>
    </div>
  );
}
