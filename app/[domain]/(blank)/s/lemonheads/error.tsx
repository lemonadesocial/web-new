'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '$lib/components/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        route: 'lemonheads',
        component: 'error-boundary',
      },
      extra: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="max-w-3xl w-full space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An error occurred while loading the Lemonheads page. This could be a server-side error or an error that occurred outside component boundaries.
          </p>
        </div>

        {error.digest && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="secondary">
            Try again
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/';
            }}
            variant="tertiary"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
