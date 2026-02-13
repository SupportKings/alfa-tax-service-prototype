import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E test configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: "./e2e",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use */
	reporter: [
		["html", { outputFolder: "playwright-report" }],
		["list"],
		...(process.env.CI ? [["github"] as const] : []),
	],
	/* Shared settings for all the projects below */
	use: {
		/* Base URL to use in actions like `await page.goto('/')` */
		baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
		/* Collect trace when retrying the failed test */
		trace: "on-first-retry",
		/* Take screenshot on failure */
		screenshot: "only-on-failure",
		/* Video recording on first retry */
		video: "on-first-retry",
	},
	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
		/* Test against mobile viewports */
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		},
		{
			name: "Mobile Safari",
			use: { ...devices["iPhone 12"] },
		},
		/* Demo project - always records video for feature demos */
		{
			name: "demo",
			testMatch: /demo\.spec\.ts/,
			use: {
				...devices["Desktop Chrome"],
				video: "on",
				screenshot: "on",
				trace: "on",
				viewport: { width: 1280, height: 720 },
			},
		},
	],
	/* Auto-start dev server for E2E tests */
	webServer: {
		command: "bun dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
	/* Maximum time one test can run for */
	timeout: 30 * 1000,
	/* Expect timeout */
	expect: {
		timeout: 5 * 1000,
	},
	/* Output folder for test artifacts */
	outputDir: "test-results",
});
