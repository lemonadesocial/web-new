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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  ObjectId: { input: any; output: any; }
};

export type Config = {
  __typename?: 'Config';
  _id: Scalars['ObjectId']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  backstory?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description: Scalars['String']['output'];
  filter?: Maybe<Scalars['JSON']['output']>;
  isPublic?: Maybe<Scalars['Boolean']['output']>;
  job: Scalars['String']['output'];
  modelName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  openaiApiKey?: Maybe<Scalars['String']['output']>;
  systemMessage?: Maybe<Scalars['String']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  user?: Maybe<Scalars['ObjectId']['output']>;
  userExpanded?: Maybe<User>;
  welcomeMessage?: Maybe<Scalars['String']['output']>;
  welcomeMetadata?: Maybe<Scalars['JSON']['output']>;
};


export type ConfigWelcomeMessageArgs = {
  format?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ConfigFilter = {
  _id_eq?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  avatar_eq?: InputMaybe<Scalars['String']['input']>;
  avatar_exists?: InputMaybe<Scalars['Boolean']['input']>;
  avatar_gt?: InputMaybe<Scalars['String']['input']>;
  avatar_gte?: InputMaybe<Scalars['String']['input']>;
  avatar_in?: InputMaybe<Array<Scalars['String']['input']>>;
  avatar_lt?: InputMaybe<Scalars['String']['input']>;
  avatar_lte?: InputMaybe<Scalars['String']['input']>;
  backstory_eq?: InputMaybe<Scalars['String']['input']>;
  backstory_exists?: InputMaybe<Scalars['Boolean']['input']>;
  backstory_gt?: InputMaybe<Scalars['String']['input']>;
  backstory_gte?: InputMaybe<Scalars['String']['input']>;
  backstory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  backstory_lt?: InputMaybe<Scalars['String']['input']>;
  backstory_lte?: InputMaybe<Scalars['String']['input']>;
  createdAt_eq?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_gt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_gte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['DateTimeISO']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_lte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  description_eq?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  filter_eq?: InputMaybe<Scalars['JSON']['input']>;
  filter_exists?: InputMaybe<Scalars['Boolean']['input']>;
  filter_gt?: InputMaybe<Scalars['JSON']['input']>;
  filter_gte?: InputMaybe<Scalars['JSON']['input']>;
  filter_in?: InputMaybe<Array<Scalars['JSON']['input']>>;
  filter_lt?: InputMaybe<Scalars['JSON']['input']>;
  filter_lte?: InputMaybe<Scalars['JSON']['input']>;
  isPublic_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic_exists?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic_gt?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic_gte?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isPublic_lt?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic_lte?: InputMaybe<Scalars['Boolean']['input']>;
  job_eq?: InputMaybe<Scalars['String']['input']>;
  job_exists?: InputMaybe<Scalars['Boolean']['input']>;
  job_gt?: InputMaybe<Scalars['String']['input']>;
  job_gte?: InputMaybe<Scalars['String']['input']>;
  job_in?: InputMaybe<Array<Scalars['String']['input']>>;
  job_lt?: InputMaybe<Scalars['String']['input']>;
  job_lte?: InputMaybe<Scalars['String']['input']>;
  modelName_eq?: InputMaybe<Scalars['String']['input']>;
  modelName_exists?: InputMaybe<Scalars['Boolean']['input']>;
  modelName_gt?: InputMaybe<Scalars['String']['input']>;
  modelName_gte?: InputMaybe<Scalars['String']['input']>;
  modelName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  modelName_lt?: InputMaybe<Scalars['String']['input']>;
  modelName_lte?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  openaiApiKey_eq?: InputMaybe<Scalars['String']['input']>;
  openaiApiKey_exists?: InputMaybe<Scalars['Boolean']['input']>;
  openaiApiKey_gt?: InputMaybe<Scalars['String']['input']>;
  openaiApiKey_gte?: InputMaybe<Scalars['String']['input']>;
  openaiApiKey_in?: InputMaybe<Array<Scalars['String']['input']>>;
  openaiApiKey_lt?: InputMaybe<Scalars['String']['input']>;
  openaiApiKey_lte?: InputMaybe<Scalars['String']['input']>;
  systemMessage_eq?: InputMaybe<Scalars['String']['input']>;
  systemMessage_exists?: InputMaybe<Scalars['Boolean']['input']>;
  systemMessage_gt?: InputMaybe<Scalars['String']['input']>;
  systemMessage_gte?: InputMaybe<Scalars['String']['input']>;
  systemMessage_in?: InputMaybe<Array<Scalars['String']['input']>>;
  systemMessage_lt?: InputMaybe<Scalars['String']['input']>;
  systemMessage_lte?: InputMaybe<Scalars['String']['input']>;
  temperature_eq?: InputMaybe<Scalars['Float']['input']>;
  temperature_exists?: InputMaybe<Scalars['Boolean']['input']>;
  temperature_gt?: InputMaybe<Scalars['Float']['input']>;
  temperature_gte?: InputMaybe<Scalars['Float']['input']>;
  temperature_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  temperature_lt?: InputMaybe<Scalars['Float']['input']>;
  temperature_lte?: InputMaybe<Scalars['Float']['input']>;
  topP_eq?: InputMaybe<Scalars['Float']['input']>;
  topP_exists?: InputMaybe<Scalars['Boolean']['input']>;
  topP_gt?: InputMaybe<Scalars['Float']['input']>;
  topP_gte?: InputMaybe<Scalars['Float']['input']>;
  topP_in?: InputMaybe<Array<Scalars['Float']['input']>>;
  topP_lt?: InputMaybe<Scalars['Float']['input']>;
  topP_lte?: InputMaybe<Scalars['Float']['input']>;
  updatedAt_eq?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['DateTimeISO']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  user_eq?: InputMaybe<Scalars['ObjectId']['input']>;
  user_exists?: InputMaybe<Scalars['Boolean']['input']>;
  user_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  user_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  user_in?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  user_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  user_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  welcomeMessage_eq?: InputMaybe<Scalars['String']['input']>;
  welcomeMessage_exists?: InputMaybe<Scalars['Boolean']['input']>;
  welcomeMessage_gt?: InputMaybe<Scalars['String']['input']>;
  welcomeMessage_gte?: InputMaybe<Scalars['String']['input']>;
  welcomeMessage_in?: InputMaybe<Array<Scalars['String']['input']>>;
  welcomeMessage_lt?: InputMaybe<Scalars['String']['input']>;
  welcomeMessage_lte?: InputMaybe<Scalars['String']['input']>;
  welcomeMetadata_eq?: InputMaybe<Scalars['JSON']['input']>;
  welcomeMetadata_exists?: InputMaybe<Scalars['Boolean']['input']>;
  welcomeMetadata_gt?: InputMaybe<Scalars['JSON']['input']>;
  welcomeMetadata_gte?: InputMaybe<Scalars['JSON']['input']>;
  welcomeMetadata_in?: InputMaybe<Array<Scalars['JSON']['input']>>;
  welcomeMetadata_lt?: InputMaybe<Scalars['JSON']['input']>;
  welcomeMetadata_lte?: InputMaybe<Scalars['JSON']['input']>;
};

export type ConfigInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  backstory?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['JSON']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  job: Scalars['String']['input'];
  modelName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  openaiApiKey?: InputMaybe<Scalars['String']['input']>;
  systemMessage?: InputMaybe<Scalars['String']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  topP?: InputMaybe<Scalars['Float']['input']>;
  welcomeMessage?: InputMaybe<Scalars['String']['input']>;
  welcomeMetadata?: InputMaybe<Scalars['JSON']['input']>;
};

export type ConfigPaginatedResponse = {
  __typename?: 'ConfigPaginatedResponse';
  items: Array<Config>;
  pageInfo: PaginatedResponsePageInfo;
};

export type Document = {
  __typename?: 'Document';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  user?: Maybe<Scalars['ObjectId']['output']>;
  userExpanded?: Maybe<User>;
};

export type DocumentFilter = {
  _id_eq?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  createdAt_eq?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_gt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_gte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['DateTimeISO']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  createdAt_lte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  metadata_eq?: InputMaybe<Scalars['JSON']['input']>;
  metadata_exists?: InputMaybe<Scalars['Boolean']['input']>;
  metadata_gt?: InputMaybe<Scalars['JSON']['input']>;
  metadata_gte?: InputMaybe<Scalars['JSON']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['JSON']['input']>>;
  metadata_lt?: InputMaybe<Scalars['JSON']['input']>;
  metadata_lte?: InputMaybe<Scalars['JSON']['input']>;
  text_eq?: InputMaybe<Scalars['String']['input']>;
  text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  text_gt?: InputMaybe<Scalars['String']['input']>;
  text_gte?: InputMaybe<Scalars['String']['input']>;
  text_in?: InputMaybe<Array<Scalars['String']['input']>>;
  text_lt?: InputMaybe<Scalars['String']['input']>;
  text_lte?: InputMaybe<Scalars['String']['input']>;
  updatedAt_eq?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_exists?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['DateTimeISO']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['DateTimeISO']['input']>;
  user_eq?: InputMaybe<Scalars['ObjectId']['input']>;
  user_exists?: InputMaybe<Scalars['Boolean']['input']>;
  user_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  user_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  user_in?: InputMaybe<Array<Scalars['ObjectId']['input']>>;
  user_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  user_lte?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type DocumentInput = {
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  text: Scalars['String']['input'];
};

export type DocumentPaginatedResponse = {
  __typename?: 'DocumentPaginatedResponse';
  items: Array<Document>;
  pageInfo: PaginatedResponsePageInfo;
};

export type Mutation = {
  __typename?: 'Mutation';
  createConfig: Config;
  createDocument: Document;
  deleteConfig: Scalars['Boolean']['output'];
  deleteDocument: Scalars['Boolean']['output'];
  run: RunResult;
  updateConfig?: Maybe<Config>;
  updateDocument?: Maybe<Document>;
};


export type MutationCreateConfigArgs = {
  input: ConfigInput;
};


export type MutationCreateDocumentArgs = {
  input: DocumentInput;
};


export type MutationDeleteConfigArgs = {
  _id: Scalars['ObjectId']['input'];
};


export type MutationDeleteDocumentArgs = {
  _id: Scalars['ObjectId']['input'];
};


export type MutationRunArgs = {
  config: Scalars['ObjectId']['input'];
  data?: InputMaybe<Scalars['JSON']['input']>;
  message: Scalars['String']['input'];
  session?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateConfigArgs = {
  _id: Scalars['ObjectId']['input'];
  input: ConfigInput;
};


export type MutationUpdateDocumentArgs = {
  _id: Scalars['ObjectId']['input'];
  input: DocumentInput;
};

export type PaginatedResponsePageInfo = {
  __typename?: 'PaginatedResponsePageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  config: Config;
  configs: ConfigPaginatedResponse;
  documents: DocumentPaginatedResponse;
};


export type QueryConfigArgs = {
  _id: Scalars['ObjectId']['input'];
};


export type QueryConfigsArgs = {
  endBefore?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ConfigFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startAfter?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentsArgs = {
  endBefore?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<DocumentFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startAfter?: InputMaybe<Scalars['String']['input']>;
};

export type RunResult = {
  __typename?: 'RunResult';
  message: Scalars['String']['output'];
  metadata: Scalars['JSON']['output'];
  sourceDocuments: Array<Scalars['JSON']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  sessionToken: Scalars['String']['output'];
};


export type SubscriptionSessionTokenArgs = {
  session: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId']['output'];
  image_avatar?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type AiConfigFieldsFragment = { __typename: 'Config', _id: any, createdAt: any, updatedAt: any, avatar?: string | null, backstory?: string | null, description: string, filter?: any | null, isPublic?: boolean | null, job: string, modelName?: string | null, name: string, openaiApiKey?: string | null, systemMessage?: string | null, temperature?: number | null, topP?: number | null, user?: any | null, welcomeMessage?: string | null, welcomeMetadata?: any | null, userExpanded?: { __typename: 'User', _id: any, name: string, image_avatar?: string | null } | null } & { ' $fragmentName'?: 'AiConfigFieldsFragment' };

export type GetAiConfigQueryVariables = Exact<{
  id: Scalars['ObjectId']['input'];
}>;


export type GetAiConfigQuery = { __typename: 'Query', config: (
    { __typename: 'Config' }
    & { ' $fragmentRefs'?: { 'AiConfigFieldsFragment': AiConfigFieldsFragment } }
  ) };

export type GetListAiConfigQueryVariables = Exact<{
  filter?: InputMaybe<ConfigFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  startAfter?: InputMaybe<Scalars['String']['input']>;
  endBefore?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetListAiConfigQuery = { __typename: 'Query', configs: { __typename: 'ConfigPaginatedResponse', items: Array<(
      { __typename: 'Config' }
      & { ' $fragmentRefs'?: { 'AiConfigFieldsFragment': AiConfigFieldsFragment } }
    )>, pageInfo: { __typename: 'PaginatedResponsePageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean } } };

export type RunAiChatMutationVariables = Exact<{
  message: Scalars['String']['input'];
  config: Scalars['ObjectId']['input'];
  session?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['JSON']['input']>;
}>;


export type RunAiChatMutation = { __typename: 'Mutation', run: { __typename: 'RunResult', message: string, sourceDocuments: Array<any>, metadata: any } };

export type UpdateAiConfigMutationVariables = Exact<{
  input: ConfigInput;
  id: Scalars['ObjectId']['input'];
}>;


export type UpdateAiConfigMutation = { __typename: 'Mutation', updateConfig?: (
    { __typename: 'Config' }
    & { ' $fragmentRefs'?: { 'AiConfigFieldsFragment': AiConfigFieldsFragment } }
  ) | null };

export type CreateAiConfigMutationVariables = Exact<{
  input: ConfigInput;
}>;


export type CreateAiConfigMutation = { __typename: 'Mutation', createConfig: (
    { __typename: 'Config' }
    & { ' $fragmentRefs'?: { 'AiConfigFieldsFragment': AiConfigFieldsFragment } }
  ) };

export const AiConfigFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AIConfigFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Config"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"backstory"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"filter"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"job"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openaiApiKey"}},{"kind":"Field","name":{"kind":"Name","value":"systemMessage"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"topP"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMessage"}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMetadata"}}]}}]} as unknown as DocumentNode<AiConfigFieldsFragment, unknown>;
export const GetAiConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAIConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AIConfigFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AIConfigFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Config"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"backstory"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"filter"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"job"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openaiApiKey"}},{"kind":"Field","name":{"kind":"Name","value":"systemMessage"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"topP"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMessage"}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMetadata"}}]}}]} as unknown as DocumentNode<GetAiConfigQuery, GetAiConfigQueryVariables>;
export const GetListAiConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListAIConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startAfter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endBefore"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"configs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"startAfter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startAfter"}}},{"kind":"Argument","name":{"kind":"Name","value":"endBefore"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endBefore"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AIConfigFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AIConfigFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Config"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"backstory"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"filter"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"job"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openaiApiKey"}},{"kind":"Field","name":{"kind":"Name","value":"systemMessage"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"topP"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMessage"}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMetadata"}}]}}]} as unknown as DocumentNode<GetListAiConfigQuery, GetListAiConfigQueryVariables>;
export const RunAiChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RunAIChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"config"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"session"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"run"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}},{"kind":"Argument","name":{"kind":"Name","value":"config"},"value":{"kind":"Variable","name":{"kind":"Name","value":"config"}}},{"kind":"Argument","name":{"kind":"Name","value":"session"},"value":{"kind":"Variable","name":{"kind":"Name","value":"session"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"sourceDocuments"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<RunAiChatMutation, RunAiChatMutationVariables>;
export const UpdateAiConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAIConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"updateConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AIConfigFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AIConfigFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Config"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"backstory"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"filter"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"job"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openaiApiKey"}},{"kind":"Field","name":{"kind":"Name","value":"systemMessage"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"topP"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMessage"}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMetadata"}}]}}]} as unknown as DocumentNode<UpdateAiConfigMutation, UpdateAiConfigMutationVariables>;
export const CreateAiConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAIConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"createConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AIConfigFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AIConfigFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Config"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"backstory"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"filter"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"job"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openaiApiKey"}},{"kind":"Field","name":{"kind":"Name","value":"systemMessage"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"topP"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userExpanded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image_avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMessage"}},{"kind":"Field","name":{"kind":"Name","value":"welcomeMetadata"}}]}}]} as unknown as DocumentNode<CreateAiConfigMutation, CreateAiConfigMutationVariables>;