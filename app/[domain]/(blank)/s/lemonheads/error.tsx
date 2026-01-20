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
    console.error('Lemonheads Error Boundary:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
    });

    if (typeof window !== 'undefined' && Sentry?.captureException) {
      Sentry.captureException(error, {
        tags: {
          route: 'lemonheads',
          component: 'error-boundary',
        },
        extra: {
          digest: error.digest,
        },
      });
    }
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

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="font-mono text-sm space-y-2">
            <div>
              <strong>Error:</strong> {error.message || 'Unknown error'}
            </div>
            {error.digest && (
              <div>
                <strong>Digest:</strong> {error.digest}
              </div>
            )}
            {error.name && (
              <div>
                <strong>Type:</strong> {error.name}
              </div>
            )}
            {error.stack && (
              <details className="mt-4">
                <summary className="cursor-pointer font-semibold">Stack Trace</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-64 p-2 rounded">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>

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
