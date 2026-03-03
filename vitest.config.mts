import path from 'node:path';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      '@craftjs/core': path.resolve(__dirname, '__tests__/__mocks__/craftjs-core.ts'),
    },
  },
  test: {
    dir: '__tests__',
    environment: 'jsdom',
    coverage: {
      exclude: ['*.{ts,mjs}', '**/app/*', ...coverageConfigDefaults.exclude],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
});
