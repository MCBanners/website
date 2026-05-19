import { defineConfig, devices } from '@playwright/test'

const appPort = Number(process.env.PLAYWRIGHT_PORT || 4173)
const apiPort = Number(process.env.PLAYWRIGHT_API_PORT || 4310)
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${appPort}`
const apiBaseURL = process.env.PLAYWRIGHT_API_BASE_URL || `http://127.0.0.1:${apiPort}`
const shouldStartApp = !process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: {
    timeout: 15_000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  reporter: process.env.CI ? [['github'], ['html']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    serviceWorkers: 'block'
  },
  webServer: shouldStartApp
    ? [
        {
          command: 'node ./tests/e2e/support/mock-api-server.mjs',
          url: `${apiBaseURL}/health`,
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
          stdout: 'pipe',
          stderr: 'pipe',
          env: {
            PLAYWRIGHT_API_PORT: String(apiPort)
          }
        },
        {
          command: `node ./tests/e2e/support/ensure-nuxt-cache.mjs && pnpm exec nuxt dev --host 127.0.0.1 --port ${appPort}`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          stdout: 'pipe',
          stderr: 'pipe',
          env: {
            PLAYWRIGHT_PORT: String(appPort),
            NUXT_PUBLIC_MCBANNERS_API_BASE: apiBaseURL
          }
        }
      ]
    : undefined,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
