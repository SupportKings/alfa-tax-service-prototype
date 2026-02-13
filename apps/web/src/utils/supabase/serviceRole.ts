import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
		getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
}
