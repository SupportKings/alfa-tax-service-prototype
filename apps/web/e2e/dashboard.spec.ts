import { expect, test } from "./fixtures/auth.fixture";

test.describe("Dashboard", () => {
	// Note: These tests use the authenticated fixture
	// In a real implementation, you would need to set up proper auth

	test.skip("should display dashboard for authenticated users", async ({
		authenticatedPage,
	}) => {
		// Skip until proper auth is configured
		await authenticatedPage.goto("/dashboard");

		// Check for dashboard content
		await expect(authenticatedPage).toHaveURL(/\/dashboard/);
	});

	test.skip("should display user information", async ({
		authenticatedPage,
	}) => {
		await authenticatedPage.goto("/dashboard");

		// Look for user-related content
		// Adjust based on your actual dashboard UI
		const userSection = authenticatedPage.locator("[data-testid='user-info']");
		await expect(userSection).toBeVisible();
	});

	test.skip("should have working sidebar navigation", async ({
		authenticatedPage,
	}) => {
		await authenticatedPage.goto("/dashboard");

		// Check for sidebar
		const sidebar = authenticatedPage.locator("[data-slot='sidebar']");
		await expect(sidebar).toBeVisible();

		// Check for navigation items
		const navItems = sidebar.getByRole("link");
		const count = await navItems.count();
		expect(count).toBeGreaterThan(0);
	});

	test.skip("should support dark mode toggle", async ({
		authenticatedPage,
	}) => {
		await authenticatedPage.goto("/dashboard");

		// Look for theme toggle
		const themeToggle = authenticatedPage.getByRole("button", {
			name: /theme|dark|light/i,
		});

		if (await themeToggle.isVisible()) {
			// Get initial state
			const html = authenticatedPage.locator("html");
			const initialClass = await html.getAttribute("class");

			// Toggle theme
			await themeToggle.click();

			// Check that class changed
			const newClass = await html.getAttribute("class");

			// Theme should have changed (dark to light or vice versa)
			expect(newClass).not.toBe(initialClass);
		}
	});
});
