import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
	test("should load the home page", async ({ page }) => {
		await page.goto("/");

		// Wait for the page to be fully loaded
		await page.waitForLoadState("networkidle");

		// Check that the page has loaded (adjust based on your actual content)
		await expect(page).toHaveTitle(/OpsKings/i);
	});

	test("should have proper meta tags", async ({ page }) => {
		await page.goto("/");

		// Check for viewport meta tag
		const viewport = await page
			.locator('meta[name="viewport"]')
			.getAttribute("content");
		expect(viewport).toContain("width=device-width");
	});

	test("should be responsive on mobile", async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");

		// Page should still be accessible
		await expect(page).toHaveTitle(/OpsKings/i);
	});

	test("should handle navigation", async ({ page }) => {
		await page.goto("/");

		// Check that basic navigation works (adjust based on your actual links)
		const links = page.getByRole("link");
		const linkCount = await links.count();

		// Page should have at least some links
		expect(linkCount).toBeGreaterThan(0);
	});
});
