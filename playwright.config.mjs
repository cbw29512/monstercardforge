import { defineConfig, devices } from '@playwright/test';

const configuredBaseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const baseURL = `${configuredBaseURL.replace(/\/+$/, '')}/`;
const useLocalServer = !process.env.PLAYWRIGHT_SKIP_WEB_SERVER;

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.spec.mjs',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: process.env.CI
    ? [['line'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    serviceWorkers: 'block'
  },
  ...(useLocalServer ? {
    webServer: {
      command: 'node tests/browser/server.mjs',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 15_000
    }
  } : {}),
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 15'] } }
  ]
});
