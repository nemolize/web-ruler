import { defineConfig, devices } from "@playwright/test";

import { localServerURL } from "./port";

export default defineConfig({
  testDir: "./e2e-tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: localServerURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: localServerURL,
    // Reusing a server this run did not start would test whatever already
    // holds the port, which is the failure the override exists to avoid.
    reuseExistingServer: false,
  },
});
