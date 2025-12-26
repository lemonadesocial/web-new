import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';
import { Types } from '@graphql-codegen/plugin-helpers';

import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset';

let generates: Record<string, Types.ConfiguredOutput | Types.ConfiguredPlugin[]> = {
  './lib/graphql/generated/backend/': {
    schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    documents: ['./lib/graphql/gql/backend/*.gql'],
    preset: 'client',
    plugins: [],
    documentTransforms: [addTypenameSelectionDocumentTransform],
  },
};

// const AIRSTACK_SCHEMA = process.env.NEXT_PUBLIC_AIRSTACK_URL;
// if (AIRSTACK_SCHEMA) {
//   generates['./lib/graphql/generated/farcaster/'] = {
//     schema: AIRSTACK_SCHEMA,
//     documents: ['./lib/graphql/gql/farcaster/*.gql'],
//     preset: 'client',
//     plugins: [],
//     documentTransforms: [addTypenameSelectionDocumentTransform],
//   };
// }

const METAVERSE_SCHEMA = process.env.te;
if (METAVERSE_SCHEMA) {
  generates['./lib/graphql/generated/metaverse/'] = {
    schema: METAVERSE_SCHEMA,
    documents: ['./lib/graphql/gql/metaverse/*.gql'],
    preset: 'client',
    plugins: [],
    documentTransforms: [addTypenameSelectionDocumentTransform],
  };
}

const WALLET_SCHEMA = process.env.NEXT_PUBLIC_WALLET_HTTP_URL;
if (WALLET_SCHEMA) {
  generates['./lib/graphql/generated/wallet/'] = {
    schema: WALLET_SCHEMA,
    documents: ['./lib/graphql/gql/wallet/*.gql'],
    preset: 'client',
    plugins: [],
    documentTransforms: [addTypenameSelectionDocumentTransform],
  };
}

// const LEMONHEADS_SCHEMA = process.env.NEXT_PUBLIC_LEMONHEADS_INDEXER_URL;
// if (LEMONHEADS_SCHEMA) {
//   generates['./lib/graphql/generated/lemonheads/'] = {
//     schema: LEMONHEADS_SCHEMA,
//     documents: ['./lib/graphql/gql/lemonheads/*.gql'],
//     preset: 'client',
//     plugins: [],
//     documentTransforms: [addTypenameSelectionDocumentTransform],
//   };
// }

const COIN_INDEXER = process.env.NEXT_PUBLIC_COIN_INDEXER_URL;
if (COIN_INDEXER) {
  generates['./lib/graphql/generated/coin/'] = {
    schema: COIN_INDEXER,
    documents: ['./lib/graphql/gql/coin/*.gql'],
    preset: 'client',
    plugins: [],
  }
}

const USERNAME_INDEXER = process.env.NEXT_PUBLIC_USERNAME_INDEXER;
if (USERNAME_INDEXER) {
  generates['./lib/graphql/generated/username/'] = {
    schema: USERNAME_INDEXER,
    documents: ['./lib/graphql/gql/username/*.gql'],
    preset: 'client',
    plugins: [],
    documentTransforms: [addTypenameSelectionDocumentTransform],
  };
}

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  generates,
};

export default config;
