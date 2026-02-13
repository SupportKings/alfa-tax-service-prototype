"use server";

import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";

// Mock session for E2E tests
const e2eMockSession = {
	session: {
		id: "e2e-test-session",
		userId: "e2e-test-user",
		token: "e2e-mock-token",
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		createdAt: new Date(),
		updatedAt: new Date(),
		ipAddress: "127.0.0.1",
		userAgent: "Playwright",
		impersonatedBy: null,
	},
	user: {
		id: "e2e-test-user",
		name: "E2E Test User",
		email: "e2e@test.com",
		emailVerified: true,
		image: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		role: "admin",
		banned: null,
		banReason: null,
		banExpires: null,
	},
};

//for server side usage in rscs
export const getUser = async () => {
	// E2E test bypass - return mock session (NEVER runs in production)
	if (process.env.NODE_ENV !== "production") {
		const cookieStore = await cookies();
		const isE2ETest = cookieStore.get("E2E_TEST")?.value === "true";
		if (isE2ETest) {
			return e2eMockSession;
		}
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session;
};
