import { describe, expect, it } from "vitest";
import { z } from "zod";

// Define the schema matching the action
const addUserSchema = z.object({
	email: z.string().email("Invalid email address"),
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
});

/**
 * Unit tests for add user action validation
 */
describe("addUserSchema validation", () => {
	const validInput = {
		email: "john.doe@example.com",
		first_name: "John",
		last_name: "Doe",
	};

	describe("Success scenarios", () => {
		it("validates complete valid input", () => {
			const result = addUserSchema.safeParse(validInput);
			expect(result.success).toBe(true);
		});

		it("accepts various valid email formats", () => {
			const emails = [
				"user@domain.com",
				"user.name@domain.com",
				"user+tag@domain.com",
				"user@subdomain.domain.com",
			];

			for (const email of emails) {
				const result = addUserSchema.safeParse({ ...validInput, email });
				expect(result.success).toBe(true);
			}
		});
	});

	describe("Email validation", () => {
		it("rejects empty email", () => {
			const result = addUserSchema.safeParse({ ...validInput, email: "" });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Invalid email address");
			}
		});

		it("rejects invalid email format", () => {
			const invalidEmails = [
				"notanemail",
				"missing@domain",
				"@nodomain.com",
				"spaces in@email.com",
			];

			for (const email of invalidEmails) {
				const result = addUserSchema.safeParse({ ...validInput, email });
				expect(result.success).toBe(false);
			}
		});

		it("rejects missing email", () => {
			const { email: _email, ...withoutEmail } = validInput;
			const result = addUserSchema.safeParse(withoutEmail);
			expect(result.success).toBe(false);
		});
	});

	describe("First name validation", () => {
		it("rejects empty first name", () => {
			const result = addUserSchema.safeParse({
				...validInput,
				first_name: "",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("First name is required");
			}
		});

		it("rejects missing first name", () => {
			const { first_name: _firstName, ...withoutFirstName } = validInput;
			const result = addUserSchema.safeParse(withoutFirstName);
			expect(result.success).toBe(false);
		});

		it("accepts single character first name", () => {
			const result = addUserSchema.safeParse({
				...validInput,
				first_name: "J",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Last name validation", () => {
		it("rejects empty last name", () => {
			const result = addUserSchema.safeParse({
				...validInput,
				last_name: "",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Last name is required");
			}
		});

		it("rejects missing last name", () => {
			const { last_name: _lastName, ...withoutLastName } = validInput;
			const result = addUserSchema.safeParse(withoutLastName);
			expect(result.success).toBe(false);
		});

		it("accepts single character last name", () => {
			const result = addUserSchema.safeParse({
				...validInput,
				last_name: "D",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Edge cases", () => {
		it("accepts names with special characters", () => {
			const result = addUserSchema.safeParse({
				...validInput,
				first_name: "Mary-Jane",
				last_name: "O'Connor",
			});
			expect(result.success).toBe(true);
		});

		it("accepts unicode names", () => {
			const result = addUserSchema.safeParse({
				...validInput,
				first_name: "José",
				last_name: "García",
			});
			expect(result.success).toBe(true);
		});

		it("rejects null values", () => {
			const result = addUserSchema.safeParse({
				email: null,
				first_name: null,
				last_name: null,
			});
			expect(result.success).toBe(false);
		});
	});
});
