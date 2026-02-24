'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '$lib/components/core';

export default function EventManageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { route: 'event-manage', component: 'error-boundary' },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-color-tertiary">
          An error occurred in event management. Please try again.
        </p>
        {error.digest && (
          <p className="text-sm text-color-quaternary">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="secondary">
            Try again
          </Button>
          <Button
            onClick={() => { window.location.href = '/'; }}
            variant="tertiary"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
