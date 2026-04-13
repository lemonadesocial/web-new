'use client';

import React from 'react';
import { format } from 'date-fns';

import { SpaceVerificationState, SpaceVerificationSubmission } from '$lib/graphql/generated/backend/graphql';

function getVerificationStatusInfo(submission: SpaceVerificationSubmission): {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  actionLabel?: string;
} {
  if (submission.state === SpaceVerificationState.Approved) {
    return {
      icon: 'icon-check text-success-500',
      iconBg: 'bg-success-500/16',
      title: 'Verification Request Approved',
      description: 'Your community has been verified and you can now enjoy higher invite and newsletter limits.',
    };
  }

  if (submission.state === SpaceVerificationState.Rejected) {
    return {
      icon: 'icon-x text-danger-400',
      iconBg: 'bg-danger-400/16',
      title: 'Verification Request Not approved',
      description: 'We were unable to verify your community. Please make sure you provide accurate information.',
      actionLabel: 'Submit Another Request',
    };
  }

  return {
    icon: 'icon-email text-tertiary',
    iconBg: 'bg-(--btn-tertiary)',
    title: 'Verification Request Received',
    description: `We received your application on ${format(
      new Date(submission.updated_at || submission.created_at),
      'd MMMM',
    )}. We process most submissions within 30 minutes and all submissions within 12 hours.`,
  };
}

export function VerificationSubmissionStatusCard({
  submission,
  onRejectedAction,
}: {
  submission: SpaceVerificationSubmission;
  onRejectedAction?: () => void;
}) {
  const statusInfo = getVerificationStatusInfo(submission);

  return (
    <div className="rounded-lg border border-card-border bg-card p-4 flex flex-col gap-4">
      <div className={`size-14 rounded-full flex items-center justify-center ${statusInfo.iconBg}`}>
        <i aria-hidden="true" className={`${statusInfo.icon} size-8`} />
      </div>
      <div className="space-y-2">
        <p className="text-lg leading-6">{statusInfo.title}</p>
        <p className="text-sm text-secondary">{statusInfo.description}</p>
        {submission.state === SpaceVerificationState.Rejected && statusInfo.actionLabel && onRejectedAction ? (
          <button
            type="button"
            className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
            onClick={onRejectedAction}
          >
            {statusInfo.actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
