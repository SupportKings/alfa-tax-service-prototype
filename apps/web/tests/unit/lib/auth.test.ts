import { describe, expect, it, vi } from "vitest";

// Mock pg Pool - must be a class/constructor
vi.mock("pg", () => {
	class MockPool {
		connectionString: string;
		constructor(config: { connectionString?: string }) {
			this.connectionString = config?.connectionString || "";
		}
		query = vi.fn();
		connect = vi.fn();
		end = vi.fn();
	}
	return { Pool: MockPool };
});

// Mock better-auth
vi.mock("better-auth", () => ({
	betterAuth: vi.fn((config) => ({
		config,
		handler: vi.fn(),
		api: {
			getSession: vi.fn(),
		},
	})),
}));

// Mock better-auth/next-js
vi.mock("better-auth/next-js", () => ({
	nextCookies: vi.fn(() => ({
		id: "nextCookies",
	})),
}));

// Mock better-auth/plugins
vi.mock("better-auth/plugins", () => ({
	admin: vi.fn((config) => ({
		id: "admin",
		config,
	})),
	emailOTP: vi.fn((config) => ({
		id: "emailOTP",
		config,
	})),
}));

// Mock better-auth/plugins/passkey
vi.mock("better-auth/plugins/passkey", () => ({
	passkey: vi.fn(() => ({
		id: "passkey",
	})),
}));

// Mock the sendOTP action
vi.mock("@/features/auth/actions/sendOtp", () => ({
	sendOTP: vi.fn(),
}));

// Import after mocks are set up
import { auth } from "@/lib/auth";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, emailOTP } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

describe("auth", () => {
	describe("auth instance", () => {
		it("is defined", () => {
			expect(auth).toBeDefined();
		});

		it("calls betterAuth", () => {
			expect(betterAuth).toHaveBeenCalled();
		});

		it("has config from betterAuth", () => {
			expect(auth.config).toBeDefined();
		});
	});

	describe("session configuration", () => {
		it("configures cookie cache", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			expect(config.session).toBeDefined();
			expect(config.session?.cookieCache).toBeDefined();
			expect(config.session?.cookieCache?.enabled).toBe(true);
			expect(config.session?.cookieCache?.maxAge).toBe(5 * 60);
		});
	});

	describe("trusted origins configuration", () => {
		it("includes localhost origins", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			expect(config.trustedOrigins).toBeDefined();
			expect(Array.isArray(config.trustedOrigins)).toBe(true);
			expect(config.trustedOrigins).toContain("http://localhost:3000");
			expect(config.trustedOrigins).toContain("http://localhost:3000");
		});

		it("trustedOrigins is an array of strings", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			expect(Array.isArray(config.trustedOrigins)).toBe(true);
			// All values should be truthy strings (falsy values are filtered)
			for (const origin of config.trustedOrigins || []) {
				expect(typeof origin).toBe("string");
				expect(origin).toBeTruthy();
			}
		});

		it("filters out falsy values from env variables", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			// trustedOrigins should not contain undefined, null, or empty strings
			expect(config.trustedOrigins).not.toContain(undefined);
			expect(config.trustedOrigins).not.toContain(null);
			expect(config.trustedOrigins).not.toContain("");
		});
	});

	describe("email and password configuration", () => {
		it("enables email and password auth", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			expect(config.emailAndPassword).toBeDefined();
			expect(config.emailAndPassword?.enabled).toBe(true);
		});

		it("disables sign up", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			expect(config.emailAndPassword?.disableSignUp).toBe(true);
		});
	});

	describe("database configuration", () => {
		it("passes database to betterAuth", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			expect(config.database).toBeDefined();
		});
	});

	describe("plugins configuration", () => {
		it("configures plugins array", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];

			expect(config.plugins).toBeDefined();
			expect(Array.isArray(config.plugins)).toBe(true);
		});

		it("includes passkey plugin", () => {
			expect(passkey).toHaveBeenCalled();
		});

		it("includes admin plugin with permissions config", () => {
			expect(adminPlugin).toHaveBeenCalled();

			const adminCalls = vi.mocked(adminPlugin).mock.calls;
			expect(adminCalls.length).toBeGreaterThan(0);

			const adminConfig = adminCalls[0][0];
			expect(adminConfig?.ac).toBeDefined();
			expect(adminConfig?.roles).toBeDefined();
			expect(adminConfig?.roles?.admin).toBeDefined();
			expect(adminConfig?.roles?.user).toBeDefined();
		});

		it("includes emailOTP plugin", () => {
			expect(emailOTP).toHaveBeenCalled();
		});

		it("configures emailOTP with disableSignUp", () => {
			const emailOTPCalls = vi.mocked(emailOTP).mock.calls;
			expect(emailOTPCalls.length).toBeGreaterThan(0);

			const emailOTPConfig = emailOTPCalls[0][0];
			expect(emailOTPConfig?.disableSignUp).toBe(true);
		});

		it("configures emailOTP with sendVerificationOTP function", () => {
			const emailOTPCalls = vi.mocked(emailOTP).mock.calls;
			const emailOTPConfig = emailOTPCalls[0][0];

			expect(emailOTPConfig?.sendVerificationOTP).toBeDefined();
			expect(typeof emailOTPConfig?.sendVerificationOTP).toBe("function");
		});

		it("includes nextCookies plugin", () => {
			expect(nextCookies).toHaveBeenCalled();
		});

		it("nextCookies is the last plugin", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];
			const plugins = config.plugins || [];

			// The last plugin should be the nextCookies plugin
			const lastPlugin = plugins[plugins.length - 1];
			expect(lastPlugin?.id).toBe("nextCookies");
		});

		it("has correct number of plugins", () => {
			const betterAuthCalls = vi.mocked(betterAuth).mock.calls;
			const config = betterAuthCalls[0][0];
			const plugins = config.plugins || [];

			// passkey, admin, emailOTP, nextCookies = 4 plugins
			expect(plugins.length).toBe(4);
		});
	});

	describe("sendVerificationOTP handler", () => {
		it("handles sign-in type", async () => {
			const { sendOTP } = await import("@/features/auth/actions/sendOtp");
			const emailOTPCalls = vi.mocked(emailOTP).mock.calls;
			const emailOTPConfig = emailOTPCalls[0][0];

			const sendVerificationOTP = emailOTPConfig?.sendVerificationOTP;

			if (sendVerificationOTP) {
				await sendVerificationOTP({
					email: "test@example.com",
					otp: "123456",
					type: "sign-in",
				});

				expect(sendOTP).toHaveBeenCalledWith({
					email: "test@example.com",
					otp: "123456",
					type: "sign-in",
				});
			}
		});

		it("handles email-verification type without sending", async () => {
			const { sendOTP } = await import("@/features/auth/actions/sendOtp");
			vi.mocked(sendOTP).mockClear();

			const emailOTPCalls = vi.mocked(emailOTP).mock.calls;
			const emailOTPConfig = emailOTPCalls[0][0];

			const sendVerificationOTP = emailOTPConfig?.sendVerificationOTP;

			if (sendVerificationOTP) {
				await sendVerificationOTP({
					email: "test@example.com",
					otp: "123456",
					type: "email-verification",
				});

				// email-verification case is commented out, so sendOTP should not be called
				expect(sendOTP).not.toHaveBeenCalled();
			}
		});

		it("handles default type without sending", async () => {
			const { sendOTP } = await import("@/features/auth/actions/sendOtp");
			vi.mocked(sendOTP).mockClear();

			const emailOTPCalls = vi.mocked(emailOTP).mock.calls;
			const emailOTPConfig = emailOTPCalls[0][0];

			const sendVerificationOTP = emailOTPConfig?.sendVerificationOTP;

			if (sendVerificationOTP) {
				await sendVerificationOTP({
					email: "test@example.com",
					otp: "123456",
					type: "forget-password" as
						| "sign-in"
						| "email-verification"
						| "forget-password",
				});

				// default case is commented out, so sendOTP should not be called
				expect(sendOTP).not.toHaveBeenCalled();
			}
		});
	});
});
