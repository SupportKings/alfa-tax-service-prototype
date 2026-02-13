import { vi } from "vitest";
import type { MockSession, MockUser } from "./mock-auth";
import { createMockSession, createMockUser } from "./mock-auth";

/**
 * Setup for mocking revalidatePath from next/cache
 */
export function createRevalidatePathMock() {
	return vi.fn();
}

/**
 * Mocks the next/cache module with revalidatePath
 */
export function mockNextCache() {
	const revalidatePath = createRevalidatePathMock();
	return {
		revalidatePath,
		revalidateTag: vi.fn(),
		unstable_cache: vi.fn((fn) => fn),
		unstable_noStore: vi.fn(),
	};
}

/**
 * Creates a mock user session for server action testing
 */
export interface MockAuthContext {
	user: MockUser | null;
	session: MockSession | null;
}

/**
 * Creates an authenticated context
 */
export function mockAuthenticatedContext(
	userOverrides: Partial<MockUser> = {},
): MockAuthContext {
	const user = createMockUser(userOverrides);
	const session = createMockSession({ userId: user.id });
	return { user, session };
}

/**
 * Creates an unauthenticated context
 */
export function mockUnauthenticatedContext(): MockAuthContext {
	return { user: null, session: null };
}

/**
 * Mock the @/queries/getUser module
 *
 * @example
 * ```typescript
 * vi.mock("@/queries/getUser", () => mockGetUserModule(createMockUser()));
 * ```
 */
export function mockGetUserModule(user: MockUser | null) {
	return {
		getUser: vi.fn().mockResolvedValue(user),
	};
}

/**
 * Helper to extract validation errors from action result
 */
export function extractValidationErrors(
	result: unknown,
): Record<string, unknown> | null {
	if (
		result &&
		typeof result === "object" &&
		"validationErrors" in result &&
		result.validationErrors
	) {
		return result.validationErrors as Record<string, unknown>;
	}
	return null;
}

/**
 * Helper to check if action result indicates success
 */
export function isActionSuccess(result: unknown): boolean {
	if (!result || typeof result !== "object") return false;
	if ("data" in result && result.data) {
		const data = result.data as Record<string, unknown>;
		return data.success === true;
	}
	return false;
}

/**
 * Helper to check if action result has validation errors
 */
export function hasValidationErrors(result: unknown): boolean {
	if (!result || typeof result !== "object") return false;
	return "validationErrors" in result && result.validationErrors !== undefined;
}

/**
 * Helper to get the global _errors from validation errors
 */
export function getGlobalErrors(result: unknown): string[] {
	const errors = extractValidationErrors(result);
	if (errors && "_errors" in errors && Array.isArray(errors._errors)) {
		return errors._errors;
	}
	return [];
}

/**
 * Helper to get field-specific errors from validation errors
 */
export function getFieldErrors(result: unknown, fieldName: string): string[] {
	const errors = extractValidationErrors(result);
	if (!errors) return [];

	const fieldErrors = errors[fieldName];
	if (
		fieldErrors &&
		typeof fieldErrors === "object" &&
		"_errors" in fieldErrors
	) {
		const fe = fieldErrors as { _errors: unknown };
		if (Array.isArray(fe._errors)) {
			return fe._errors.filter((e): e is string => typeof e === "string");
		}
	}
	return [];
}

/**
 * Helper to assert common action test scenarios
 */
export const actionAssertions = {
	/**
	 * Assert action requires authentication
	 */
	requiresAuth: (result: unknown) => {
		const errors = getGlobalErrors(result);
		return errors.some(
			(e) =>
				e.toLowerCase().includes("authentication") ||
				e.toLowerCase().includes("sign in"),
		);
	},

	/**
	 * Assert action returned not found error
	 */
	notFound: (result: unknown) => {
		const errors = getGlobalErrors(result);
		return errors.some((e) => e.toLowerCase().includes("not found"));
	},

	/**
	 * Assert action was successful
	 */
	success: isActionSuccess,

	/**
	 * Assert action has validation errors
	 */
	hasErrors: hasValidationErrors,
};

/**
 * Type for safe action result
 */
export interface SafeActionResult<T = unknown> {
	data?: T;
	validationErrors?: Record<string, unknown>;
	serverError?: string;
}

/**
 * Wrapper to safely execute an action and return a typed result
 */
export async function executeAction<TInput, TOutput>(
	action: (input: TInput) => Promise<SafeActionResult<TOutput>>,
	input: TInput,
): Promise<SafeActionResult<TOutput>> {
	try {
		return await action(input);
	} catch (error) {
		return {
			serverError:
				error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
