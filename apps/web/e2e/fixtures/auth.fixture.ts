import { test as base, type Page } from "@playwright/test";

/**
 * Extended test fixture that provides authentication utilities
 * Uses E2E_TEST cookie bypass for reliable testing without real auth
 */
export interface AuthFixtures {
	authenticatedPage: Page;
}

/**
 * Custom test fixture with authentication support
 *
 * Usage:
 * ```ts
 * import { test, expect } from './fixtures/auth.fixture';
 *
 * test('authenticated test', async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto('/dashboard');
 *   // Page bypasses auth via E2E_TEST cookie
 * });
 * ```
 */
export const test = base.extend<AuthFixtures>({
	authenticatedPage: async ({ page, context }, use) => {
		// Set E2E test bypass cookie before any navigation
		await context.addCookies([
			{
				name: "E2E_TEST",
				value: "true",
				domain: "localhost",
				path: "/",
			},
		]);

		// Navigate to home first to ensure cookie is active
		await page.goto("/", { waitUntil: "domcontentloaded" });

		// Use the authenticated page
		await use(page);

		// Cleanup after test
		await context.clearCookies();
	},
});

export { expect } from "@playwright/test";
