import { defineConfig, devices } from "@playwright/test";

/**
 * E2E testlar — ishlab turgan stack'ga qarshi (http://localhost:8080).
 * Ishga tushirish:  cd frontend && BASE_URL=http://localhost:8080 npx playwright test
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8080",
    headless: true,
    screenshot: "only-on-failure",
    locale: "uz",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
