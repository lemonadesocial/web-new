/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Address: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  ObjectId: { input: any; output: any; }
  Uint69: { input: any; output: any; }
  Uint256: { input: any; output: any; }
};

export type ChainlinkRequest = {
  __typename?: 'ChainlinkRequest';
  fulfilled?: Maybe<Scalars['Boolean']['output']>;
};

export type Claim = {
  __typename?: 'Claim';
  _id: Scalars['ObjectId']['output'];
  address?: Maybe<Scalars['Address']['output']>;
  args: ClaimArgs;
  chainlinkRequest?: Maybe<ChainlinkRequest>;
  /** @deprecated Use `errorMessage` */
  error?: Maybe<Scalars['String']['output']>;
  errorDescription?: Maybe<Scalars['JSON']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  network: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['Address']['output']>;
  tokenId?: Maybe<Scalars['Uint256']['output']>;
};

export type ClaimArgs = {
  __typename?: 'ClaimArgs';
  claimer?: Maybe<Scalars['Address']['output']>;
  /** Only compatible with FestivalHeadsV1 */
  tokenURI?: Maybe<Scalars['String']['output']>;
};

export type ClaimArgsInput = {
  claimer?: InputMaybe<Scalars['Address']['input']>;
  /** Only compatible with FestivalHeadsV1 */
  tokenURI?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  claimPoap: Claim;
  createPoap: Poap;
  setPolicy: PolicyResult;
  transfer: Transfer;
};


export type MutationClaimPoapArgs = {
  address: Scalars['Address']['input'];
  input?: InputMaybe<ClaimArgsInput>;
  network: Scalars['String']['input'];
  to?: InputMaybe<Scalars['Address']['input']>;
};


export type MutationCreatePoapArgs = {
  input: PoapArgsInput;
  network: Scalars['String']['input'];
  signature?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSetPolicyArgs = {
  input: SetPolicyInput;
  signature?: InputMaybe<Scalars['String']['input']>;
};


export type MutationTransferArgs = {
  address: Scalars['Address']['input'];
  input: TransferArgsInput;
  network: Scalars['String']['input'];
};

export type NodeError = {
  __typename?: 'NodeError';
  message?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
};

export type Poap = {
  __typename?: 'Poap';
  _id: Scalars['ObjectId']['output'];
  address?: Maybe<Scalars['Address']['output']>;
  /** @deprecated Use `errorMessage` */
  error?: Maybe<Scalars['String']['output']>;
  errorDescription?: Maybe<Scalars['JSON']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  network: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['Address']['output']>;
};

export type PoapArgs = {
  __typename?: 'PoapArgs';
  chainlinkRequest?: Maybe<Scalars['Boolean']['output']>;
  creator?: Maybe<Scalars['Address']['output']>;
  maxSupply: Scalars['Uint256']['output'];
  name: Scalars['String']['output'];
  royalties: Array<PoapArgsRoyalties>;
  symbol: Scalars['String']['output'];
  tokenURI: Scalars['String']['output'];
};

export type PoapArgsInput = {
  chainlinkRequest?: InputMaybe<Scalars['Boolean']['input']>;
  creator?: InputMaybe<Scalars['Address']['input']>;
  maxSupply: Scalars['Uint256']['input'];
  name: Scalars['String']['input'];
  royalties: Array<PoapArgsRoyaltiesInput>;
  symbol: Scalars['String']['input'];
  tokenURI: Scalars['String']['input'];
};

export type PoapArgsRoyalties = {
  __typename?: 'PoapArgsRoyalties';
  account: Scalars['Address']['output'];
  value: Scalars['Uint69']['output'];
};

export type PoapArgsRoyaltiesInput = {
  account: Scalars['Address']['input'];
  value: Scalars['Uint69']['input'];
};

export type Policy = {
  __typename?: 'Policy';
  _id: Scalars['ObjectId']['output'];
  address: Scalars['Address']['output'];
  network: Scalars['String']['output'];
  node: Scalars['JSON']['output'];
};

export type PolicyResult = {
  __typename?: 'PolicyResult';
  _id: Scalars['ObjectId']['output'];
  address: Scalars['Address']['output'];
  network: Scalars['String']['output'];
  node: Scalars['JSON']['output'];
  result?: Maybe<Result>;
};

export type Query = {
  __typename?: 'Query';
  getPolicy?: Maybe<PolicyResult>;
  poapSignMessage: Scalars['String']['output'];
  poapView: Array<Scalars['String']['output']>;
  policySignMessage: Scalars['String']['output'];
};


export type QueryGetPolicyArgs = {
  address: Scalars['Address']['input'];
  network: Scalars['String']['input'];
  target?: InputMaybe<Scalars['Address']['input']>;
};


export type QueryPoapSignMessageArgs = {
  input: PoapArgsInput;
  network: Scalars['String']['input'];
};


export type QueryPoapViewArgs = {
  address: Scalars['Address']['input'];
  args?: InputMaybe<Array<Scalars['JSON']['input']>>;
  name: Scalars['String']['input'];
  network: Scalars['String']['input'];
};


export type QueryPolicySignMessageArgs = {
  input: SetPolicyInput;
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type Result = {
  __typename?: 'Result';
  boolean: Scalars['Boolean']['output'];
  errors: Array<NodeError>;
  node: Scalars['JSON']['output'];
};

export type SetPolicyInput = {
  address: Scalars['Address']['input'];
  network: Scalars['String']['input'];
  node: Scalars['JSON']['input'];
  secrets?: InputMaybe<Scalars['JSON']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  claimModified: Claim;
  poapModified: Poap;
  transferModified: Transfer;
};


export type SubscriptionClaimModifiedArgs = {
  input?: InputMaybe<ClaimArgsInput>;
};


export type SubscriptionPoapModifiedArgs = {
  input: PoapArgsInput;
  network: Scalars['String']['input'];
};

export type Transaction = {
  __typename?: 'Transaction';
  _id: Scalars['ObjectId']['output'];
  /** @deprecated Use `errorMessage` */
  error?: Maybe<Scalars['String']['output']>;
  errorDescription?: Maybe<Scalars['JSON']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  network: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['Address']['output']>;
};

export type Transfer = {
  __typename?: 'Transfer';
  _id: Scalars['ObjectId']['output'];
  address?: Maybe<Scalars['Address']['output']>;
  args: TransferArgs;
  /** @deprecated Use `errorMessage` */
  error?: Maybe<Scalars['String']['output']>;
  errorDescription?: Maybe<Scalars['JSON']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  network: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['Address']['output']>;
  tokenId?: Maybe<Scalars['Uint256']['output']>;
};

export type TransferArgs = {
  __typename?: 'TransferArgs';
  to: Scalars['Address']['output'];
  tokenId: Scalars['Uint256']['output'];
};

export type TransferArgsInput = {
  to: Scalars['Address']['input'];
  tokenId: Scalars['Uint256']['input'];
};

export type PoapViewQueryVariables = Exact<{
  network: Scalars['String']['input'];
  address: Scalars['Address']['input'];
  name: Scalars['String']['input'];
  args?: InputMaybe<Array<Scalars['JSON']['input']> | Scalars['JSON']['input']>;
}>;


export type PoapViewQuery = { __typename: 'Query', poapView: Array<string> };

export type ClaimPoapMutationVariables = Exact<{
  network: Scalars['String']['input'];
  address: Scalars['Address']['input'];
  input?: InputMaybe<ClaimArgsInput>;
}>;


export type ClaimPoapMutation = { __typename: 'Mutation', claimPoap: { __typename: 'Claim', _id: any } };

export type ClaimModifiedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ClaimModifiedSubscription = { __typename?: 'Subscription', claimModified: { __typename: 'Claim', to?: any | null, network: string, state?: string | null, errorDescription?: any | null, errorMessage?: string | null, address?: any | null, tokenId?: any | null, chainlinkRequest?: { __typename: 'ChainlinkRequest', fulfilled?: boolean | null } | null, args: { __typename: 'ClaimArgs', tokenURI?: string | null } } };

export type TransferMutationVariables = Exact<{
  input: TransferArgsInput;
  network: Scalars['String']['input'];
  address: Scalars['Address']['input'];
}>;


export type TransferMutation = { __typename: 'Mutation', transfer: { __typename: 'Transfer', _id: any, network: string, state?: string | null, to?: any | null, errorMessage?: string | null, address?: any | null, args: { __typename: 'TransferArgs', to: any, tokenId: any } } };

export type TransferModifiedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TransferModifiedSubscription = { __typename?: 'Subscription', transferModified: { __typename: 'Transfer', to?: any | null, network: string, state?: string | null, errorMessage?: string | null, address?: any | null, tokenId?: any | null, args: { __typename: 'TransferArgs', to: any, tokenId: any } } };


export const PoapViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"poapView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"poapView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"network"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<PoapViewQuery, PoapViewQueryVariables>;
export const ClaimPoapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"claimPoap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ClaimArgsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"claimPoap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"network"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<ClaimPoapMutation, ClaimPoapMutationVariables>;
export const ClaimModifiedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"claimModified"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimModified"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"errorDescription"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"chainlinkRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fulfilled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"tokenURI"}}]}}]}}]}}]} as unknown as DocumentNode<ClaimModifiedSubscription, ClaimModifiedSubscriptionVariables>;
export const TransferDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"transfer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferArgsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"network"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"transfer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"network"},"value":{"kind":"Variable","name":{"kind":"Name","value":"network"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}}]}}]}}]}}]} as unknown as DocumentNode<TransferMutation, TransferMutationVariables>;
export const TransferModifiedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"transferModified"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferModified"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}}]}}]}}]}}]} as unknown as DocumentNode<TransferModifiedSubscription, TransferModifiedSubscriptionVariables>;