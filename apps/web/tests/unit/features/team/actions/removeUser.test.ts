import { describe, expect, it } from "vitest";
import { z } from "zod";

// Define the schema matching the action
const removeUserSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

/**
 * Unit tests for remove user action validation
 */
describe("removeUserSchema validation", () => {
	describe("Success scenarios", () => {
		it("validates valid user ID", () => {
			const result = removeUserSchema.safeParse({
				userId: "user-123-abc",
			});
			expect(result.success).toBe(true);
		});

		it("validates UUID format user ID", () => {
			const result = removeUserSchema.safeParse({
				userId: "550e8400-e29b-41d4-a716-446655440000",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("User ID validation", () => {
		it("rejects empty user ID", () => {
			const result = removeUserSchema.safeParse({ userId: "" });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("User ID is required");
			}
		});

		it("rejects missing user ID", () => {
			const result = removeUserSchema.safeParse({});
			expect(result.success).toBe(false);
		});

		it("rejects null user ID", () => {
			const result = removeUserSchema.safeParse({ userId: null });
			expect(result.success).toBe(false);
		});

		it("accepts single character user ID", () => {
			const result = removeUserSchema.safeParse({ userId: "a" });
			expect(result.success).toBe(true);
		});
	});
});
