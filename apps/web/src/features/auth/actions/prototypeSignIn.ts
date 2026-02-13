"use server";

import { cookies } from "next/headers";

/**
 * Prototype-only sign-in: sets a session cookie with the email address.
 * No database required — the middleware and getUser check this cookie.
 * Any email and any OTP code are accepted.
 */
export async function prototypeSignIn({ email }: { email: string }) {
	const cookieStore = await cookies();

	cookieStore.set("PROTOTYPE_SESSION", email, {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	});

	return { success: true };
}
