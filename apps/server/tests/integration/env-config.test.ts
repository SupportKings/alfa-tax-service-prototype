import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Environment Configuration", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	it("uses CORS_ORIGIN when set", async () => {
		process.env.CORS_ORIGIN = "http://test-origin.com";

		// Dynamic import to pick up new env
		const { app } = await import("../../src/index");

		const response = await app.fetch(
			new Request("http://localhost/", {
				method: "OPTIONS",
				headers: {
					Origin: "http://test-origin.com",
				},
			}),
		);

		expect(response.status).toBe(204);
	});

	it("uses empty string when CORS_ORIGIN is not set", async () => {
		delete process.env.CORS_ORIGIN;

		// Dynamic import to pick up env without CORS_ORIGIN
		const { app } = await import("../../src/index");

		const response = await app.fetch(
			new Request("http://localhost/", {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
	});
});
