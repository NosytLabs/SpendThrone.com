import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: './playwright-global-setup.cjs',
  testDir: './tests',
  testMatch: ['**/css-visual-*.spec.ts', '**/simple-test.spec.ts', '**/debug-page.spec.ts', '**/ui-ux-fixes.spec.ts', '**/accessibility-fix-test.spec.ts', '**/comprehensive-e2e-test.spec.ts', '**/css-classes-fix-test.spec.ts', '**/comprehensive-visual-audit.spec.ts', '**/simple-visual-audit.spec.ts', '**/comprehensive-analysis.spec.ts'], // Only run specific Playwright tests
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],


});