import { describe, expect, it } from "vitest";
import { app } from "../../src/index";

describe("Hono App", () => {
	it("responds to health check on root path", async () => {
		const response = await app.fetch(new Request("http://localhost/"));

		expect(response.status).toBe(200);
		const text = await response.text();
		expect(text).toBe("OK");
	});

	it("returns 404 for unknown routes", async () => {
		const response = await app.fetch(
			new Request("http://localhost/unknown-path"),
		);

		// Hono returns 404 for unmatched routes
		expect(response.status).toBe(404);
	});

	it("allows CORS requests", async () => {
		const response = await app.fetch(
			new Request("http://localhost/", {
				method: "OPTIONS",
				headers: {
					Origin: process.env.CORS_ORIGIN || "http://localhost:3001",
				},
			}),
		);

		// CORS preflight should not return error
		expect(response.status).toBeLessThan(400);
	});
});
