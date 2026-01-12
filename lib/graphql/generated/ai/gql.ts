/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "fragment AIConfigFields on Config {\n  _id\n  createdAt\n  updatedAt\n  avatar\n  backstory\n  description\n  filter\n  isPublic\n  job\n  modelName\n  name\n  openaiApiKey\n  systemMessage\n  temperature\n  topP\n  user\n  userExpanded {\n    _id\n    name\n    image_avatar\n  }\n  welcomeMessage\n  welcomeMetadata\n}\n\nquery GetAIConfig($id: ObjectId!) {\n  config(_id: $id) {\n    ...AIConfigFields\n  }\n}\n\nquery GetListAIConfig($filter: ConfigFilter, $limit: Int, $startAfter: String, $endBefore: String) {\n  configs(\n    filter: $filter\n    limit: $limit\n    startAfter: $startAfter\n    endBefore: $endBefore\n  ) {\n    items {\n      ...AIConfigFields\n    }\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nmutation RunAIChat($message: String!, $config: ObjectId!, $session: String) {\n  run(message: $message, config: $config, session: $session) {\n    message\n    sourceDocuments\n    metadata\n  }\n}\n\nmutation UpdateAIConfig($input: ConfigInput!, $id: ObjectId!) {\n  updateConfig(input: $input, _id: $id) {\n    ...AIConfigFields\n  }\n}\n\nmutation CreateAIConfig($input: ConfigInput!) {\n  createConfig(input: $input) {\n    ...AIConfigFields\n  }\n}": typeof types.AiConfigFieldsFragmentDoc,
};
const documents: Documents = {
    "fragment AIConfigFields on Config {\n  _id\n  createdAt\n  updatedAt\n  avatar\n  backstory\n  description\n  filter\n  isPublic\n  job\n  modelName\n  name\n  openaiApiKey\n  systemMessage\n  temperature\n  topP\n  user\n  userExpanded {\n    _id\n    name\n    image_avatar\n  }\n  welcomeMessage\n  welcomeMetadata\n}\n\nquery GetAIConfig($id: ObjectId!) {\n  config(_id: $id) {\n    ...AIConfigFields\n  }\n}\n\nquery GetListAIConfig($filter: ConfigFilter, $limit: Int, $startAfter: String, $endBefore: String) {\n  configs(\n    filter: $filter\n    limit: $limit\n    startAfter: $startAfter\n    endBefore: $endBefore\n  ) {\n    items {\n      ...AIConfigFields\n    }\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nmutation RunAIChat($message: String!, $config: ObjectId!, $session: String) {\n  run(message: $message, config: $config, session: $session) {\n    message\n    sourceDocuments\n    metadata\n  }\n}\n\nmutation UpdateAIConfig($input: ConfigInput!, $id: ObjectId!) {\n  updateConfig(input: $input, _id: $id) {\n    ...AIConfigFields\n  }\n}\n\nmutation CreateAIConfig($input: ConfigInput!) {\n  createConfig(input: $input) {\n    ...AIConfigFields\n  }\n}": types.AiConfigFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment AIConfigFields on Config {\n  _id\n  createdAt\n  updatedAt\n  avatar\n  backstory\n  description\n  filter\n  isPublic\n  job\n  modelName\n  name\n  openaiApiKey\n  systemMessage\n  temperature\n  topP\n  user\n  userExpanded {\n    _id\n    name\n    image_avatar\n  }\n  welcomeMessage\n  welcomeMetadata\n}\n\nquery GetAIConfig($id: ObjectId!) {\n  config(_id: $id) {\n    ...AIConfigFields\n  }\n}\n\nquery GetListAIConfig($filter: ConfigFilter, $limit: Int, $startAfter: String, $endBefore: String) {\n  configs(\n    filter: $filter\n    limit: $limit\n    startAfter: $startAfter\n    endBefore: $endBefore\n  ) {\n    items {\n      ...AIConfigFields\n    }\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nmutation RunAIChat($message: String!, $config: ObjectId!, $session: String) {\n  run(message: $message, config: $config, session: $session) {\n    message\n    sourceDocuments\n    metadata\n  }\n}\n\nmutation UpdateAIConfig($input: ConfigInput!, $id: ObjectId!) {\n  updateConfig(input: $input, _id: $id) {\n    ...AIConfigFields\n  }\n}\n\nmutation CreateAIConfig($input: ConfigInput!) {\n  createConfig(input: $input) {\n    ...AIConfigFields\n  }\n}"): (typeof documents)["fragment AIConfigFields on Config {\n  _id\n  createdAt\n  updatedAt\n  avatar\n  backstory\n  description\n  filter\n  isPublic\n  job\n  modelName\n  name\n  openaiApiKey\n  systemMessage\n  temperature\n  topP\n  user\n  userExpanded {\n    _id\n    name\n    image_avatar\n  }\n  welcomeMessage\n  welcomeMetadata\n}\n\nquery GetAIConfig($id: ObjectId!) {\n  config(_id: $id) {\n    ...AIConfigFields\n  }\n}\n\nquery GetListAIConfig($filter: ConfigFilter, $limit: Int, $startAfter: String, $endBefore: String) {\n  configs(\n    filter: $filter\n    limit: $limit\n    startAfter: $startAfter\n    endBefore: $endBefore\n  ) {\n    items {\n      ...AIConfigFields\n    }\n    pageInfo {\n      startCursor\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nmutation RunAIChat($message: String!, $config: ObjectId!, $session: String) {\n  run(message: $message, config: $config, session: $session) {\n    message\n    sourceDocuments\n    metadata\n  }\n}\n\nmutation UpdateAIConfig($input: ConfigInput!, $id: ObjectId!) {\n  updateConfig(input: $input, _id: $id) {\n    ...AIConfigFields\n  }\n}\n\nmutation CreateAIConfig($input: ConfigInput!) {\n  createConfig(input: $input) {\n    ...AIConfigFields\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;