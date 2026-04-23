// ============================================================================
// Typed GraphQL overlay for the hostname verification flow (backend PR #2145).
// ----------------------------------------------------------------------------
// CODEGEN MIGRATION NOTICE
// ----------------------------------------------------------------------------
// This file is a TEMPORARY stand-in for operations that will eventually be
// emitted by `yarn codegen` once the live backend schema contains
// `WhitelabelHostname`, `HostnameVerificationInstructions`,
// `HostnameVerificationStatus`, `getSpace.hostname_entries`,
// `requestHostnameVerification`, and `verifyHostname` (all shipped in
// backend PR #2145 @ commit 177a6716).
//
// When `yarn codegen` is next run against that schema, three things MUST
// happen in a single commit to avoid a duplicate-identifier time-bomb:
//
//   (a) Re-add the `.gql` source file at
//       `lib/graphql/gql/backend/hostname-verification.gql` using the
//       template at the bottom of THIS file.
//   (b) Delete THIS overlay file.
//   (c) Update consumers (currently: `HostnameStatusList.tsx` and
//       `HostnameVerificationModal.tsx`) to import the documents from
//       `$lib/graphql/generated/backend/graphql` instead of this file.
//
// Error-classification helpers (`isChallengeRerolledError`,
// `getRequestVerificationErrorMessage`) live in `./errors.ts` already — they
// are codegen-independent and survive the migration untouched.
//
// If you forget step (a), codegen simply won't emit the operations and the
// app will fail to compile. If you forget step (b), you get
// duplicate-identifier TS errors between this file and the generated one.
// If you forget step (c), consumers keep importing from the overlay.
//
// GQL TEMPLATE (paste verbatim into the new `.gql` file):
//
//   fragment WhitelabelHostnameFragment on WhitelabelHostname {
//     hostname
//     verified
//     challenge_token
//     verified_at
//     created_at
//     last_checked_at
//     last_check_error
//   }
//
//   query GetSpaceHostnameEntries($id: MongoID!) {
//     getSpace(_id: $id) {
//       _id
//       hostname_entries {
//         ...WhitelabelHostnameFragment
//       }
//     }
//   }
//
//   mutation RequestHostnameVerification($space_id: MongoID!, $hostname: String!) {
//     requestHostnameVerification(space_id: $space_id, hostname: $hostname) {
//       hostname
//       challenge_token
//       txt_record_name
//       txt_record_value
//       verified
//     }
//   }
//
//   mutation VerifyHostname($space_id: MongoID!, $hostname: String!) {
//     verifyHostname(space_id: $space_id, hostname: $hostname) {
//       hostname
//       verified
//       challenge_token
//       verified_at
//       created_at
//       last_checked_at
//       last_check_error
//       txt_record_name
//       txt_record_value
//     }
//   }
// ============================================================================

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
