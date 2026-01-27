'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '$lib/components/core';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  componentName: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error(`Error in ${this.props.componentName}:`, error);

    if (typeof window !== 'undefined' && Sentry?.captureException) {
      Sentry.captureException(error, {
        tags: {
          route: 'lemonheads',
          component: this.props.componentName,
        },
      });
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          componentName={this.props.componentName}
          reset={this.reset}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({
  error,
  componentName,
  reset,
}: {
  error: Error & { digest?: string };
  componentName: string;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="max-w-2xl w-full space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An error occurred in <strong>{componentName}</strong>.
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="font-mono text-sm space-y-2">
            <div>
              <strong>Error:</strong> {error.message || 'Unknown error'}
            </div>
            {error.name && (
              <div>
                <strong>Type:</strong> {error.name}
              </div>
            )}
            {error.digest && (
              <div>
                <strong>Digest:</strong> {error.digest}
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
