import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Туршилтын файлууд tests хавтаст байрлана.
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },

  // Локал ажиллуулалтын HTML тайлан playwright-report хавтаст үүснэ.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,

    // SauceDemo data-test attribute-г getByTestId() locator-д ашиглана.
    testIdAttribute: 'data-test',

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
