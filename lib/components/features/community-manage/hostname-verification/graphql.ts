// Typed GraphQL overlay for the hostname verification flow (backend PR #2145).
// Canonical source: lib/graphql/gql/backend/hostname-verification.gql. The next
// `yarn codegen` run against a schema that includes #2145 will regenerate the
// same shapes in `$lib/graphql/generated/backend/graphql`, after which this
// file can be switched to a re-export pass-through or deleted with callers
// repointed. Until then, this keeps the modal type-checkable and testable
// without requiring live-schema access.

import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export type WhitelabelHostname = {
  __typename?: 'WhitelabelHostname';
  hostname: string;
  verified: boolean;
  challenge_token: string;
  verified_at?: string | null;
  created_at: string;
  last_checked_at?: string | null;
  last_check_error?: string | null;
};

export type HostnameVerificationInstructions = {
  __typename?: 'HostnameVerificationInstructions';
  hostname: string;
  challenge_token: string;
  txt_record_name: string;
  txt_record_value: string;
  verified: boolean;
};

export type HostnameVerificationStatus = WhitelabelHostname & {
  txt_record_name: string;
  txt_record_value: string;
};

export type GetSpaceHostnameEntriesQueryVariables = {
  id: string;
};

export type GetSpaceHostnameEntriesQuery = {
  __typename?: 'Query';
  getSpace?: {
    __typename?: 'Space';
    _id?: string | null;
    hostname_entries?: Array<WhitelabelHostname> | null;
  } | null;
};

export type RequestHostnameVerificationMutationVariables = {
  space_id: string;
  hostname: string;
};

export type RequestHostnameVerificationMutation = {
  __typename?: 'Mutation';
  requestHostnameVerification: HostnameVerificationInstructions;
};

export type VerifyHostnameMutationVariables = {
  space_id: string;
  hostname: string;
};

export type VerifyHostnameMutation = {
  __typename?: 'Mutation';
  verifyHostname: HostnameVerificationStatus;
};

export const GetSpaceHostnameEntriesDocument = parse(/* GraphQL */ `
  query GetSpaceHostnameEntries($id: MongoID!) {
    getSpace(_id: $id) {
      __typename
      _id
      hostname_entries {
        __typename
        hostname
        verified
        challenge_token
        verified_at
        created_at
        last_checked_at
        last_check_error
      }
    }
  }
`) as unknown as TypedDocumentNode<
  GetSpaceHostnameEntriesQuery,
  GetSpaceHostnameEntriesQueryVariables
>;

export const RequestHostnameVerificationDocument = parse(/* GraphQL */ `
  mutation RequestHostnameVerification($space_id: MongoID!, $hostname: String!) {
    requestHostnameVerification(space_id: $space_id, hostname: $hostname) {
      __typename
      hostname
      challenge_token
      txt_record_name
      txt_record_value
      verified
    }
  }
`) as unknown as TypedDocumentNode<
  RequestHostnameVerificationMutation,
  RequestHostnameVerificationMutationVariables
>;

export const VerifyHostnameDocument = parse(/* GraphQL */ `
  mutation VerifyHostname($space_id: MongoID!, $hostname: String!) {
    verifyHostname(space_id: $space_id, hostname: $hostname) {
      __typename
      hostname
      verified
      challenge_token
      verified_at
      created_at
      last_checked_at
      last_check_error
      txt_record_name
      txt_record_value
    }
  }
`) as unknown as TypedDocumentNode<
  VerifyHostnameMutation,
  VerifyHostnameMutationVariables
>;

// Backend throws 409 with the phrase below when a concurrent
// requestHostnameVerification re-rolled the challenge mid-flight.
// The generic error surface (`client.ts:249`) only preserves `.message`,
// so we match on message text rather than status code.
export function isChallengeRerolledError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const message = (error as { message?: unknown }).message;
  if (typeof message !== 'string') return false;
  return /hostname challenge changed concurrently/i.test(message);
}
