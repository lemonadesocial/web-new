 
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
    "query poapView($network: String!, $address: Address!, $name: String!, $args: [JSON!]) {\n  poapView(network: $network, address: $address, name: $name, args: $args)\n}\n\nmutation claimPoap($network: String!, $address: Address!, $input: ClaimArgsInput) {\n  claimPoap(network: $network, address: $address, input: $input) {\n    _id\n  }\n}\n\nsubscription claimModified {\n  claimModified {\n    to\n    network\n    state\n    errorDescription\n    errorMessage\n    address\n    tokenId\n    chainlinkRequest {\n      fulfilled\n    }\n    args {\n      tokenURI\n    }\n  }\n}\n\nmutation transfer($input: TransferArgsInput!, $network: String!, $address: Address!) {\n  transfer(input: $input, network: $network, address: $address) {\n    _id\n    network\n    state\n    to\n    errorMessage\n    address\n    args {\n      to\n      tokenId\n    }\n  }\n}\n\nsubscription transferModified {\n  transferModified {\n    to\n    network\n    state\n    errorMessage\n    address\n    tokenId\n    args {\n      to\n      tokenId\n    }\n  }\n}": typeof types.PoapViewDocument,
};
const documents: Documents = {
    "query poapView($network: String!, $address: Address!, $name: String!, $args: [JSON!]) {\n  poapView(network: $network, address: $address, name: $name, args: $args)\n}\n\nmutation claimPoap($network: String!, $address: Address!, $input: ClaimArgsInput) {\n  claimPoap(network: $network, address: $address, input: $input) {\n    _id\n  }\n}\n\nsubscription claimModified {\n  claimModified {\n    to\n    network\n    state\n    errorDescription\n    errorMessage\n    address\n    tokenId\n    chainlinkRequest {\n      fulfilled\n    }\n    args {\n      tokenURI\n    }\n  }\n}\n\nmutation transfer($input: TransferArgsInput!, $network: String!, $address: Address!) {\n  transfer(input: $input, network: $network, address: $address) {\n    _id\n    network\n    state\n    to\n    errorMessage\n    address\n    args {\n      to\n      tokenId\n    }\n  }\n}\n\nsubscription transferModified {\n  transferModified {\n    to\n    network\n    state\n    errorMessage\n    address\n    tokenId\n    args {\n      to\n      tokenId\n    }\n  }\n}": types.PoapViewDocument,
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
export function graphql(source: "query poapView($network: String!, $address: Address!, $name: String!, $args: [JSON!]) {\n  poapView(network: $network, address: $address, name: $name, args: $args)\n}\n\nmutation claimPoap($network: String!, $address: Address!, $input: ClaimArgsInput) {\n  claimPoap(network: $network, address: $address, input: $input) {\n    _id\n  }\n}\n\nsubscription claimModified {\n  claimModified {\n    to\n    network\n    state\n    errorDescription\n    errorMessage\n    address\n    tokenId\n    chainlinkRequest {\n      fulfilled\n    }\n    args {\n      tokenURI\n    }\n  }\n}\n\nmutation transfer($input: TransferArgsInput!, $network: String!, $address: Address!) {\n  transfer(input: $input, network: $network, address: $address) {\n    _id\n    network\n    state\n    to\n    errorMessage\n    address\n    args {\n      to\n      tokenId\n    }\n  }\n}\n\nsubscription transferModified {\n  transferModified {\n    to\n    network\n    state\n    errorMessage\n    address\n    tokenId\n    args {\n      to\n      tokenId\n    }\n  }\n}"): (typeof documents)["query poapView($network: String!, $address: Address!, $name: String!, $args: [JSON!]) {\n  poapView(network: $network, address: $address, name: $name, args: $args)\n}\n\nmutation claimPoap($network: String!, $address: Address!, $input: ClaimArgsInput) {\n  claimPoap(network: $network, address: $address, input: $input) {\n    _id\n  }\n}\n\nsubscription claimModified {\n  claimModified {\n    to\n    network\n    state\n    errorDescription\n    errorMessage\n    address\n    tokenId\n    chainlinkRequest {\n      fulfilled\n    }\n    args {\n      tokenURI\n    }\n  }\n}\n\nmutation transfer($input: TransferArgsInput!, $network: String!, $address: Address!) {\n  transfer(input: $input, network: $network, address: $address) {\n    _id\n    network\n    state\n    to\n    errorMessage\n    address\n    args {\n      to\n      tokenId\n    }\n  }\n}\n\nsubscription transferModified {\n  transferModified {\n    to\n    network\n    state\n    errorMessage\n    address\n    tokenId\n    args {\n      to\n      tokenId\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;