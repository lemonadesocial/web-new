import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  documents: ['./lib/gql/**/*.gql'],
  ignoreNoDocuments: true,
  generates: {
    './lib/generated/': {
      preset: 'client',
      plugins: [],
      documentTransforms: [addTypenameSelectionDocumentTransform],
    },
  },
};

export default config;
