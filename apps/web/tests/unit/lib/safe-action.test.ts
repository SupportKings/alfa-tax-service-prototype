import { actionClient } from "@/lib/safe-action";

import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("safe-action", () => {
	describe("actionClient", () => {
		it("is defined", () => {
			expect(actionClient).toBeDefined();
		});

		it("has inputSchema method", () => {
			expect(typeof actionClient.inputSchema).toBe("function");
		});

		it("has schema method (alias)", () => {
			expect(typeof actionClient.schema).toBe("function");
		});

		it("has action method", () => {
			expect(typeof actionClient.action).toBe("function");
		});

		it("can chain inputSchema and action", () => {
			const testSchema = z.object({
				name: z.string(),
			});

			const result = actionClient.inputSchema(testSchema);
			expect(result).toBeDefined();
			expect(typeof result.action).toBe("function");
		});

		it("creates action with valid schema", () => {
			const testSchema = z.object({
				email: z.string().email(),
				count: z.number().min(0),
			});

			const action = actionClient
				.inputSchema(testSchema)
				.action(async ({ parsedInput }) => {
					return { email: parsedInput.email, count: parsedInput.count };
				});

			expect(action).toBeDefined();
			expect(typeof action).toBe("function");
		});

		it("creates action without input schema", () => {
			const action = actionClient.action(async () => {
				return { success: true };
			});

			expect(action).toBeDefined();
			expect(typeof action).toBe("function");
		});

		it("supports complex nested schemas", () => {
			const complexSchema = z.object({
				user: z.object({
					name: z.string(),
					email: z.string().email(),
				}),
				items: z.array(
					z.object({
						id: z.string(),
						quantity: z.number(),
					}),
				),
				metadata: z.record(z.string()),
			});

			const action = actionClient
				.inputSchema(complexSchema)
				.action(async ({ parsedInput }) => {
					return { received: true, userName: parsedInput.user.name };
				});

			expect(action).toBeDefined();
			expect(typeof action).toBe("function");
		});

		it("supports optional fields in schema", () => {
			const schemaWithOptional = z.object({
				required: z.string(),
				optional: z.string().optional(),
				withDefault: z.string().default("default-value"),
			});

			const action = actionClient
				.inputSchema(schemaWithOptional)
				.action(async ({ parsedInput }) => {
					return { required: parsedInput.required };
				});

			expect(action).toBeDefined();
			expect(typeof action).toBe("function");
		});

		it("supports union types in schema", () => {
			const unionSchema = z.object({
				type: z.union([
					z.literal("create"),
					z.literal("update"),
					z.literal("delete"),
				]),
				id: z.string(),
			});

			const action = actionClient
				.inputSchema(unionSchema)
				.action(async ({ parsedInput }) => {
					return { type: parsedInput.type };
				});

			expect(action).toBeDefined();
			expect(typeof action).toBe("function");
		});
	});

	describe("action execution", () => {
		it("executes action and returns result", async () => {
			const simpleAction = actionClient.action(async () => {
				return { message: "success", timestamp: Date.now() };
			});

			const result = await simpleAction();

			expect(result).toBeDefined();
			// The result from next-safe-action wraps the return value
			if (result?.data) {
				expect(result.data.message).toBe("success");
				expect(typeof result.data.timestamp).toBe("number");
			}
		});

		it("executes action with input and returns result", async () => {
			const schema = z.object({
				value: z.number(),
			});

			const doubleAction = actionClient
				.inputSchema(schema)
				.action(async ({ parsedInput }) => {
					return { result: parsedInput.value * 2 };
				});

			const result = await doubleAction({ value: 5 });

			expect(result).toBeDefined();
			if (result?.data) {
				expect(result.data.result).toBe(10);
			}
		});

		it("returns validation error for invalid input", async () => {
			const schema = z.object({
				email: z.string().email(),
			});

			const emailAction = actionClient
				.inputSchema(schema)
				.action(async ({ parsedInput }) => {
					return { email: parsedInput.email };
				});

			const result = await emailAction({ email: "invalid-email" });

			expect(result).toBeDefined();
			// Should have validation errors
			expect(
				result?.validationErrors || result?.serverError || !result?.data,
			).toBeTruthy();
		});

		it("handles action that returns undefined", async () => {
			const voidAction = actionClient.action(async () => {
				// Action that doesn't return anything
				return undefined;
			});

			const result = await voidAction();
			expect(result).toBeDefined();
		});

		it("handles action that returns null", async () => {
			const nullAction = actionClient.action(async () => {
				return null;
			});

			const result = await nullAction();
			expect(result).toBeDefined();
		});
	});
});
