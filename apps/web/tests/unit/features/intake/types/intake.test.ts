import {
	CLIENT_TYPE_OPTIONS,
	intakeFormSchema,
	SERVICE_OPTIONS,
} from "@/features/intake/types";

import { describe, expect, it } from "vitest";

describe("intakeFormSchema", () => {
	const validInput = {
		first_name: "Tony",
		last_name: "Devilich",
		email: "tony@example.com",
		phone: "(210) 555-0100",
		client_type: "Individual" as const,
		services: ["Personal Tax Return" as const],
		notes: "",
	};

	it("validates correct input", () => {
		const result = intakeFormSchema.safeParse(validInput);
		expect(result.success).toBe(true);
	});

	it("validates input with multiple services", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			services: [
				"Personal Tax Return",
				"Bookkeeping",
				"Advisory / Tax Planning",
			],
		});
		expect(result.success).toBe(true);
	});

	it("validates business client type", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			client_type: "Business",
		});
		expect(result.success).toBe(true);
	});

	it("validates input with notes", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			notes: "I have two rental properties and need help with tax planning.",
		});
		expect(result.success).toBe(true);
	});

	it("rejects empty first name", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			first_name: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejects empty last name", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			last_name: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejects invalid email", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			email: "not-an-email",
		});
		expect(result.success).toBe(false);
	});

	it("rejects empty email", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			email: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejects empty phone", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			phone: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejects invalid client type", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			client_type: "Corporation",
		});
		expect(result.success).toBe(false);
	});

	it("rejects empty services array", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			services: [],
		});
		expect(result.success).toBe(false);
	});

	it("rejects invalid service option", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			services: ["Nonexistent Service"],
		});
		expect(result.success).toBe(false);
	});

	it("trims whitespace from first name", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			first_name: "  Tony  ",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.first_name).toBe("Tony");
		}
	});

	it("lowercases email", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			email: "Tony@Example.COM",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.email).toBe("tony@example.com");
		}
	});

	it("rejects first name exceeding max length", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			first_name: "A".repeat(51),
		});
		expect(result.success).toBe(false);
	});

	it("rejects notes exceeding max length", () => {
		const result = intakeFormSchema.safeParse({
			...validInput,
			notes: "A".repeat(2001),
		});
		expect(result.success).toBe(false);
	});

	it("defaults notes to empty string when omitted", () => {
		const { notes: _notes, ...inputWithoutNotes } = validInput;
		const result = intakeFormSchema.safeParse(inputWithoutNotes);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.notes).toBe("");
		}
	});
});

describe("SERVICE_OPTIONS", () => {
	it("contains expected services", () => {
		expect(SERVICE_OPTIONS).toContain("Personal Tax Return");
		expect(SERVICE_OPTIONS).toContain("Business Tax Return");
		expect(SERVICE_OPTIONS).toContain("Bookkeeping");
		expect(SERVICE_OPTIONS).toContain("Advisory / Tax Planning");
		expect(SERVICE_OPTIONS).toContain("Business Formation");
		expect(SERVICE_OPTIONS).toContain("Sales Tax");
		expect(SERVICE_OPTIONS).toContain("Payroll");
	});

	it("has 7 service options", () => {
		expect(SERVICE_OPTIONS).toHaveLength(7);
	});
});

describe("CLIENT_TYPE_OPTIONS", () => {
	it("contains Individual and Business", () => {
		expect(CLIENT_TYPE_OPTIONS).toContain("Individual");
		expect(CLIENT_TYPE_OPTIONS).toContain("Business");
	});

	it("has 2 options", () => {
		expect(CLIENT_TYPE_OPTIONS).toHaveLength(2);
	});
});
