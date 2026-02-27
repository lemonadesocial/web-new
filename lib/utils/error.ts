import { BaseError } from 'viem';
import { TRPCClientError } from '@trpc/client';

export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}

export function formatError(error: unknown): string {
  if (error instanceof BaseError) {
    return error.shortMessage || 'An unexpected error occurred. Please try again';
  }

  if (error instanceof TRPCClientError) {
    return error.message;
  }

  return getErrorMessage(error, 'An unexpected error occurred. Please try again');
}
