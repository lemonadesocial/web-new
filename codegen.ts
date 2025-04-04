import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';
import { Types } from '@graphql-codegen/plugin-helpers';

import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset';

let generates: Record<string, Types.ConfiguredOutput | Types.ConfiguredPlugin[]> = {
  './lib/generated/backend/': {
    schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    documents: ['./lib/gql/backend/*.gql'],
    preset: 'client',
    plugins: [],
    documentTransforms: [addTypenameSelectionDocumentTransform],
  },
};

const AIRSTACK_SCHEMA = process.env.NEXT_PUBLIC_AIRSTACK_URL;
if (AIRSTACK_SCHEMA) {
  generates['./lib/generated/farcaster/'] = {
    schema: AIRSTACK_SCHEMA,
    documents: ['./lib/gql/farcaster/*.gql'],
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
