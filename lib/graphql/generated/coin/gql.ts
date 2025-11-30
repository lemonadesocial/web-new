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
    "query PoolSwap($where: PoolSwap_bool_exp, $orderBy: [PoolSwap_order_by!], $limit: Int, $offset: Int) {\n  PoolSwap(where: $where, order_by: $orderBy, limit: $limit, offset: $offset) {\n    blockNumber\n    blockTimestamp\n    transactionHash\n    flAmount0\n    flAmount1\n    flFee0\n    flFee1\n    id\n    ispAmount0\n    ispAmount1\n    ispFee0\n    ispFee1\n    poolId\n    uniAmount0\n    uniAmount1\n    uniFee0\n    uniFee1\n  }\n}\n\nquery MemecoinHolder($where: MemecoinHolder_bool_exp, $orderBy: [MemecoinHolder_order_by!], $limit: Int, $offset: Int) {\n  MemecoinHolder(\n    where: $where\n    order_by: $orderBy\n    limit: $limit\n    offset: $offset\n  ) {\n    balance\n    chainId\n    holder\n    id\n    memecoin\n  }\n}": typeof types.PoolSwapDocument,
};
const documents: Documents = {
    "query PoolSwap($where: PoolSwap_bool_exp, $orderBy: [PoolSwap_order_by!], $limit: Int, $offset: Int) {\n  PoolSwap(where: $where, order_by: $orderBy, limit: $limit, offset: $offset) {\n    blockNumber\n    blockTimestamp\n    transactionHash\n    flAmount0\n    flAmount1\n    flFee0\n    flFee1\n    id\n    ispAmount0\n    ispAmount1\n    ispFee0\n    ispFee1\n    poolId\n    uniAmount0\n    uniAmount1\n    uniFee0\n    uniFee1\n  }\n}\n\nquery MemecoinHolder($where: MemecoinHolder_bool_exp, $orderBy: [MemecoinHolder_order_by!], $limit: Int, $offset: Int) {\n  MemecoinHolder(\n    where: $where\n    order_by: $orderBy\n    limit: $limit\n    offset: $offset\n  ) {\n    balance\n    chainId\n    holder\n    id\n    memecoin\n  }\n}": types.PoolSwapDocument,
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
export function graphql(source: "query PoolSwap($where: PoolSwap_bool_exp, $orderBy: [PoolSwap_order_by!], $limit: Int, $offset: Int) {\n  PoolSwap(where: $where, order_by: $orderBy, limit: $limit, offset: $offset) {\n    blockNumber\n    blockTimestamp\n    transactionHash\n    flAmount0\n    flAmount1\n    flFee0\n    flFee1\n    id\n    ispAmount0\n    ispAmount1\n    ispFee0\n    ispFee1\n    poolId\n    uniAmount0\n    uniAmount1\n    uniFee0\n    uniFee1\n  }\n}\n\nquery MemecoinHolder($where: MemecoinHolder_bool_exp, $orderBy: [MemecoinHolder_order_by!], $limit: Int, $offset: Int) {\n  MemecoinHolder(\n    where: $where\n    order_by: $orderBy\n    limit: $limit\n    offset: $offset\n  ) {\n    balance\n    chainId\n    holder\n    id\n    memecoin\n  }\n}"): (typeof documents)["query PoolSwap($where: PoolSwap_bool_exp, $orderBy: [PoolSwap_order_by!], $limit: Int, $offset: Int) {\n  PoolSwap(where: $where, order_by: $orderBy, limit: $limit, offset: $offset) {\n    blockNumber\n    blockTimestamp\n    transactionHash\n    flAmount0\n    flAmount1\n    flFee0\n    flFee1\n    id\n    ispAmount0\n    ispAmount1\n    ispFee0\n    ispFee1\n    poolId\n    uniAmount0\n    uniAmount1\n    uniFee0\n    uniFee1\n  }\n}\n\nquery MemecoinHolder($where: MemecoinHolder_bool_exp, $orderBy: [MemecoinHolder_order_by!], $limit: Int, $offset: Int) {\n  MemecoinHolder(\n    where: $where\n    order_by: $orderBy\n    limit: $limit\n    offset: $offset\n  ) {\n    balance\n    chainId\n    holder\n    id\n    memecoin\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;