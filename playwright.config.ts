import { defineConfig, devices } from '@playwright/test';

export const BASE_URL =
  process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  // Ambiente compartilhado com outros candidatos: poucos workers para não gerar carga.
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    locale: 'pt-BR',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { extraHTTPHeaders: { 'Content-Type': 'application/json' } },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
