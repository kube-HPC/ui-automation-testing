import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, ".env") });

const isKeycloakEnabled =
  (process.env.VITE_KEYCLOAK_ENABLE || "").toLowerCase() === "true";
const authStatePath = path.resolve(__dirname, "playwright/.auth/user.json");

const chromeDesktopConfig = {
  ...devices["Desktop Chrome"],
  channel: "chrome",
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ["github"],
        ["list", { printSteps: true }],
        ["json", { outputFile: "test-results/results.json" }],
        ["html", { open: "never" }],
      ]
    : [["list"], ["html", { open: "on-failure" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || "http://localhost:9050",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    headless: process.env.CI ? true : false,
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      slowMo: 200,
    },
  },

  /* Configure projects for major browsers */
  projects: isKeycloakEnabled
    ? [
        {
          name: "setup",
          testMatch: "**/*.setup.ts",
          use: chromeDesktopConfig,
        },
        {
          name: "chrome",
          dependencies: ["setup"],
          testIgnore: ["**/*.setup.ts", "**/LoginAndLogout.spec.ts"],
          use: {
            ...chromeDesktopConfig,
            storageState: authStatePath,
          },
        },
        {
          name: "auth-flow",
          testMatch: "**/LoginAndLogout.spec.ts",
          use: chromeDesktopConfig,
        },
      ]
    : [
        {
          name: "chrome",
          testIgnore: ["**/*.setup.ts"],
          use: chromeDesktopConfig,
        },
      ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
