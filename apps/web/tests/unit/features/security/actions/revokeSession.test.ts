import { describe, expect, it } from "vitest";
import { z } from "zod";

// Define the schema matching the action
const revokeSessionSchema = z.object({
	sessionToken: z.string().min(1, "Session token is required"),
});

/**
 * Unit tests for revoke session action validation
 */
describe("revokeSessionSchema validation", () => {
	describe("Success scenarios", () => {
		it("validates valid session token", () => {
			const result = revokeSessionSchema.safeParse({
				sessionToken: "abc123xyz789",
			});
			expect(result.success).toBe(true);
		});

		it("validates long session token", () => {
			const result = revokeSessionSchema.safeParse({
				sessionToken:
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Session token validation", () => {
		it("rejects empty session token", () => {
			const result = revokeSessionSchema.safeParse({ sessionToken: "" });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Session token is required",
				);
			}
		});

		it("rejects missing session token", () => {
			const result = revokeSessionSchema.safeParse({});
			expect(result.success).toBe(false);
		});

		it("rejects null session token", () => {
			const result = revokeSessionSchema.safeParse({ sessionToken: null });
			expect(result.success).toBe(false);
		});

		it("accepts single character session token", () => {
			const result = revokeSessionSchema.safeParse({ sessionToken: "a" });
			expect(result.success).toBe(true);
		});
	});
});
