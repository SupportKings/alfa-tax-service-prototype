import { describe, expect, it } from "vitest";
import { app } from "../../src/index";

describe("tRPC Endpoints", () => {
	it("responds to tRPC healthCheck query", async () => {
		const response = await app.fetch(
			new Request("http://localhost/trpc/healthCheck", {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.result.data).toBe("OK");
	});

	it("responds to tRPC getUser query", async () => {
		const response = await app.fetch(
			new Request("http://localhost/trpc/getUser", {
				method: "GET",
			}),
		);

		expect(response.status).toBe(200);
		const data = await response.json();
		// Should return null when not authenticated
		expect(data.result.data).toBeNull();
	});

	it("returns error for non-existent tRPC procedure", async () => {
		const response = await app.fetch(
			new Request("http://localhost/trpc/nonExistent", {
				method: "GET",
			}),
		);

		// tRPC returns 500 for procedure not found
		expect(response.status).toBeGreaterThanOrEqual(400);
	});

	it("handles tRPC batch requests", async () => {
		const response = await app.fetch(
			new Request(
				"http://localhost/trpc/healthCheck,getUser?batch=1&input={}",
				{
					method: "GET",
				},
			),
		);

		expect(response.status).toBe(200);
	});

	it("handles POST requests to tRPC", async () => {
		const response = await app.fetch(
			new Request("http://localhost/trpc/healthCheck", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			}),
		);

		// healthCheck is a query, POST should still work
		expect(response.status).toBeLessThan(500);
	});
});
