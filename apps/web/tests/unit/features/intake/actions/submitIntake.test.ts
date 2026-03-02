import { describe, expect, it, vi } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
	cookies: vi.fn().mockResolvedValue({
		getAll: vi.fn().mockReturnValue([]),
		set: vi.fn(),
	}),
	headers: vi.fn().mockResolvedValue(new Map()),
}));

// Mock safe-action
vi.mock("@/lib/safe-action", () => ({
	actionClient: {
		inputSchema: vi.fn().mockReturnValue({
			action: vi.fn().mockImplementation((handler) => {
				return async (input: Record<string, unknown>) => {
					const { intakeFormSchema } = await import("@/features/intake/types");
					const parsed = intakeFormSchema.safeParse(input);
					if (!parsed.success) {
						return { validationErrors: parsed.error.flatten() };
					}
					const result = await handler({ parsedInput: parsed.data });
					return { data: result };
				};
			}),
		}),
	},
}));

describe("submitIntakeAction", () => {
	it("succeeds with valid input", async () => {
		const { submitIntakeAction } = await import(
			"@/features/intake/actions/submitIntake"
		);

		const result = await submitIntakeAction({
			first_name: "Tony",
			last_name: "Devilich",
			email: "tony@example.com",
			phone: "(210) 555-0100",
			client_type: "Individual",
			services: ["Personal Tax Return"],
			notes: "",
		});

		expect(result?.data?.success).toBe(true);
	});

	it("rejects invalid email", async () => {
		const { submitIntakeAction } = await import(
			"@/features/intake/actions/submitIntake"
		);

		const result = await submitIntakeAction({
			first_name: "Tony",
			last_name: "Devilich",
			email: "not-valid",
			phone: "(210) 555-0100",
			client_type: "Individual",
			services: ["Personal Tax Return"],
			notes: "",
		});

		expect(result?.validationErrors).toBeDefined();
	});

	it("rejects empty services", async () => {
		const { submitIntakeAction } = await import(
			"@/features/intake/actions/submitIntake"
		);

		const result = await submitIntakeAction({
			first_name: "Tony",
			last_name: "Devilich",
			email: "tony@example.com",
			phone: "(210) 555-0100",
			client_type: "Individual",
			services: [],
			notes: "",
		});

		expect(result?.validationErrors).toBeDefined();
	});
});
