import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  outputDir: "../test-results/holding",
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4174" },
  webServer: { command: "node ../scripts/build-holding.mjs && node ../scripts/serve-holding.mjs --port 4174", url: "http://127.0.0.1:4174", reuseExistingServer: !process.env.CI },
});
