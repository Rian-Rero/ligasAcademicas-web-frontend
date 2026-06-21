import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: [
    {
      command:
        "NODE_ENV=production PINO_LOG_LEVEL=fatal PORT=3334 ALLOWED_ORIGINS='http://localhost:5174' ../ligasAcademicas-backend/node_modules/.bin/env-cmd --no-override -f ../ligasAcademicas-backend/.env.development -- node e2e/helpers/startBackend.js",
      port: 3334,
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command:
        'VITE_BACKEND_URL=http://localhost:3334 yarn dev --force --port 5174 --strictPort',
      port: 5174,
      reuseExistingServer: false,
      timeout: 30000,
    },
  ],
});
