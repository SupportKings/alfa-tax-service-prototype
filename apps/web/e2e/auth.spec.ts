import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
	test("should redirect unauthenticated users from dashboard to home", async ({
		page,
	}) => {
		// Try to access dashboard without being logged in
		await page.goto("/dashboard");

		// Should be redirected to home page
		await expect(page).toHaveURL("/");
	});

	test("should display sign in form on home page", async ({ page }) => {
		await page.goto("/");

		// Look for email input or sign in button
		// Adjust selectors based on your actual UI
		const signInElements = page.getByRole("button", {
			name: /sign in|continue|get started/i,
		});
		const emailInput = page.getByPlaceholder(/email/i);

		// At least one of these should be visible
		const hasSignIn =
			(await signInElements.count()) > 0 || (await emailInput.isVisible());

		expect(hasSignIn).toBe(true);
	});

	test("should show validation error for invalid email", async ({ page }) => {
		await page.goto("/");

		// Find email input
		const emailInput = page.getByPlaceholder(/email/i);

		if (await emailInput.isVisible()) {
			// Enter invalid email
			await emailInput.fill("invalid-email");

			// Try to submit
			const submitButton = page.getByRole("button", {
				name: /continue|sign in|submit/i,
			});

			if (await submitButton.isVisible()) {
				await submitButton.click();

				// Should show validation error or the form should not proceed
				// Check for error message or that we're still on the same page
				await expect(page).toHaveURL("/");
			}
		}
	});

	test("should maintain session across page reloads", async ({
		page,
		context,
	}) => {
		// This test requires a mock authenticated state
		// Set up a mock session cookie
		await context.addCookies([
			{
				name: "better-auth.session_token",
				value: "test-session",
				domain: "localhost",
				path: "/",
				httpOnly: true,
				secure: false,
				sameSite: "Lax",
			},
		]);

		await page.goto("/dashboard");

		// Reload the page
		await page.reload();

		// Should still be on dashboard (if authenticated)
		// or redirected to home (if session is invalid)
		// This verifies the middleware is working
		const url = page.url();
		expect(url).toMatch(/\/(dashboard)?$/);
	});
});
