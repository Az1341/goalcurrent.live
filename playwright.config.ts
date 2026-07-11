import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4877);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const useDevServer = process.env.PLAYWRIGHT_DEV === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  snapshotPathTemplate:
    "{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}",
  timeout: 90_000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: useDevServer
      ? `npm run dev -- -p ${port}`
      : `npm run start -- -p ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    {
      name: "chromium",
      testMatch: /^(?!.*visual-regression).*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testMatch: /visual-regression\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    },
  },
});