import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    include: ['__tests__/**/*.test.{ts,tsx}', 'lib/**/__tests__/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    coverage: {
      exclude: ['*.{ts,mjs}', '**/app/*', ...coverageConfigDefaults.exclude],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
});
