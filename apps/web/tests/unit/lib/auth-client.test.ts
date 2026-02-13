import { describe, expect, it, vi } from "vitest";

// Mock better-auth/client before importing authClient
vi.mock("better-auth/client", () => ({
	createAuthClient: vi.fn((config) => ({
		config,
		signIn: {
			email: vi.fn(),
			social: vi.fn(),
		},
		signOut: vi.fn(),
		signUp: {
			email: vi.fn(),
		},
		useSession: vi.fn(),
		session: {
			get: vi.fn(),
		},
		$Infer: {
			Session: {},
		},
	})),
}));

// Mock better-auth/client/plugins
vi.mock("better-auth/client/plugins", () => ({
	adminClient: vi.fn((config) => ({
		id: "admin",
		config,
	})),
	emailOTPClient: vi.fn(() => ({
		id: "emailOTP",
	})),
	passkeyClient: vi.fn(() => ({
		id: "passkey",
	})),
}));

// Now import the authClient after mocks are set up
import { authClient } from "@/lib/auth-client";

import { createAuthClient } from "better-auth/client";
import {
	adminClient,
	emailOTPClient,
	passkeyClient,
} from "better-auth/client/plugins";

describe("auth-client", () => {
	describe("authClient", () => {
		it("is defined", () => {
			expect(authClient).toBeDefined();
		});

		it("calls createAuthClient", () => {
			expect(createAuthClient).toHaveBeenCalled();
		});

		it("is created with plugins array", () => {
			const calls = vi.mocked(createAuthClient).mock.calls;
			expect(calls.length).toBeGreaterThan(0);

			const config = calls[0][0];
			expect(config).toBeDefined();
			expect(config?.plugins).toBeDefined();
			expect(Array.isArray(config?.plugins)).toBe(true);
		});

		it("includes emailOTPClient plugin", () => {
			expect(emailOTPClient).toHaveBeenCalled();
		});

		it("includes passkeyClient plugin", () => {
			expect(passkeyClient).toHaveBeenCalled();
		});

		it("includes adminClient plugin with permissions config", () => {
			expect(adminClient).toHaveBeenCalled();

			const adminCalls = vi.mocked(adminClient).mock.calls;
			expect(adminCalls.length).toBeGreaterThan(0);

			const adminConfig = adminCalls[0][0];
			expect(adminConfig).toBeDefined();
			expect(adminConfig?.ac).toBeDefined();
			expect(adminConfig?.roles).toBeDefined();
			expect(adminConfig?.roles?.admin).toBeDefined();
			expect(adminConfig?.roles?.user).toBeDefined();
		});
	});

	describe("authClient methods", () => {
		it("has signIn property", () => {
			expect(authClient.signIn).toBeDefined();
		});

		it("has signOut method", () => {
			expect(typeof authClient.signOut).toBe("function");
		});

		it("has signUp property", () => {
			expect(authClient.signUp).toBeDefined();
		});

		it("has session property", () => {
			expect(authClient.session).toBeDefined();
		});

		it("has config property from createAuthClient", () => {
			expect(authClient.config).toBeDefined();
		});
	});

	describe("plugin configuration", () => {
		it("emailOTPClient is called without arguments", () => {
			const calls = vi.mocked(emailOTPClient).mock.calls;
			expect(calls.length).toBeGreaterThan(0);
			// emailOTPClient is called with no arguments on the client side
			expect(calls[0]).toEqual([]);
		});

		it("passkeyClient is called without arguments", () => {
			const calls = vi.mocked(passkeyClient).mock.calls;
			expect(calls.length).toBeGreaterThan(0);
			// passkeyClient is called with no arguments on the client side
			expect(calls[0]).toEqual([]);
		});

		it("adminClient receives ac from permissions", () => {
			const adminCalls = vi.mocked(adminClient).mock.calls;
			const config = adminCalls[0][0];

			// Verify ac is passed (it's the access control from permissions.ts)
			expect(config?.ac).toBeDefined();
			expect(typeof config?.ac).toBe("object");
		});

		it("adminClient receives admin and user roles", () => {
			const adminCalls = vi.mocked(adminClient).mock.calls;
			const config = adminCalls[0][0];

			// Verify roles are passed
			expect(config?.roles?.admin).toBeDefined();
			expect(config?.roles?.user).toBeDefined();
		});
	});
});
