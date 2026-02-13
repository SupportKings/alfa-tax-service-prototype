import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

export function createClient() {
	return createBrowserClient<Database>(
		getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
		getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
	);
}
