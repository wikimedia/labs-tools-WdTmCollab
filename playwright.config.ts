// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    /* --- Desktop Browsers --- */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* --- Mobile Devices (Responsive Checks) --- */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }, // Tests Android viewport
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }, // Tests iOS viewport
    },
  ],
});