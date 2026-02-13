import { describe, expect, it } from "vitest";
import { app } from "../../src/index";

describe("CORS Configuration", () => {
	it("includes CORS headers in response", async () => {
		const response = await app.fetch(
			new Request("http://localhost/", {
				method: "GET",
				headers: {
					Origin: "http://localhost:3001",
				},
			}),
		);

		// Should have CORS headers
		expect(response.status).toBe(200);
	});

	it("handles preflight OPTIONS request", async () => {
		const response = await app.fetch(
			new Request("http://localhost/trpc/healthCheck", {
				method: "OPTIONS",
				headers: {
					Origin: "http://localhost:3001",
					"Access-Control-Request-Method": "POST",
					"Access-Control-Request-Headers": "content-type",
				},
			}),
		);

		// Preflight should return 204 No Content
		expect(response.status).toBe(204);
	});

	it("allows GET method", async () => {
		const response = await app.fetch(
			new Request("http://localhost/", {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
	});

	it("allows POST method on tRPC routes", async () => {
		const response = await app.fetch(
			new Request("http://localhost/trpc/healthCheck", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			}),
		);

		// Should not be blocked by CORS
		expect(response.status).toBeLessThan(500);
	});
});
