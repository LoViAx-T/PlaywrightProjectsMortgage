import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

let envFile = process.env.ENV_FILE ? process.env.ENV_FILE : "test";

dotenv.config({
   path: path.resolve(__dirname, "", `.env/${envFile}.env`),
});

export default defineConfig({
   testDir: "./tests",
   /* Run tests in files in parallel */
   fullyParallel: false,
   reporter: [
      ["html", { open: "never" }],
      ["junit", { outputFile: "test-results/results.xml" }],
   ],
   workers: 1,
   // workers: 1,
   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
   timeout: 120_000,
   expect: { timeout: 10000 },
   use: {
      baseURL: process.env.BASE_URL,
      trace: "on-first-retry",
      bypassCSP: true,
      navigationTimeout: 30_000,
   },
   retries: 1,
   /* Configure projects for major browsers */
   projects: [
      {
         name: "chromium",
         use: {
            ...devices["Desktop Chrome"],
            isMobile: false,
         },
      },
      {
         name: "firefox",
         use: {
            ...devices["Desktop Firefox"],
            isMobile: false,
         },
      },
      {
         name: "webkit",
         use: {
            ...devices["Desktop Safari"],
            isMobile: false,
         },
      },

      /* Test against mobile viewports. */
      {
         name: "Mobile Chrome",
         use: {
            ...devices["Pixel 7"],
            isMobile: true,
            launchOptions: {
               args: ["--lang=sv_SE"],
            },
         },
      },
      {
         name: "Mobile Safari",
         use: {
            ...devices["iPhone 12"],
            isMobile: true,
         },
      },

      /* Test against branded browsers. */
      // {
      //   name: 'Microsoft Edge',
      //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
      // },
      // {
      //   name: 'Google Chrome',
      //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      // },
   ],
   /* Fail the build on CI if you accidentally left test.only in the source code. */
   // forbidOnly: !!process.env.CI,
   /* Retry on CI only */
   // retries: process.env.CI ? 2 : 0,
   /* Opt out of parallel tests on CI. */
   // workers: process.env.CI ? 1 : undefined,
   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
   /* Run your local dev server before starting the tests */
   // webServer: {
   //   command: 'npm run start',
   //   url: 'http://127.0.0.1:3000',
   //   reuseExistingServer: !process.env.CI,
   // },
});
