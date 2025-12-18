import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    environmentOptions: {
      jsdom: {
        pretendToBeVisual: true
      }
    }
  }
});
