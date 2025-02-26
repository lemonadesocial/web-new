import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';

console.log(process.env.NEXT_PUBLIC_GRAPHQL_URL);
const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  documents: ['./lib/gql/**/*.gql'],
  ignoreNoDocuments: true,
  generates: {
    './lib/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
