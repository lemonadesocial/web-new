'use client';

import { twMerge } from 'tailwind-merge';

interface QueryErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function QueryError({ message = 'Failed to load', onRetry, className }: QueryErrorProps) {
  return (
    <div className={twMerge('flex items-center justify-center gap-2 py-6 text-sm', className)}>
      <i aria-hidden="true" className="icon-alert-outline size-5 text-tertiary" />
      <span className="text-secondary">{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="text-accent-400 hover:underline cursor-pointer">
          Retry
        </button>
      )}
    </div>
  );
}
