import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./tests/setup.ts"],
		// Enable Vitest's file-level caching for faster re-runs
		cache: {
			dir: ".vitest-cache",
		},
		forceRerunTriggers: ["**/vitest.config.ts", "**/tests/setup.ts"],
		include: ["tests/**/*.{test,spec}.ts", "src/**/*.{test,spec}.ts"],
		exclude: ["**/node_modules/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			reportsDirectory: "./coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"node_modules/**",
				"tests/**",
				"**/*.d.ts",
				"**/*.config.*",
				"**/types/**",
				// Server startup/retry logic is runtime-only
				"src/index.ts",
				// Database connection setup
				"src/db/**",
				// Logger utility (runtime infrastructure)
				"src/lib/logger.ts",
				// Middleware (rate limiting, etc. - tested via integration/E2E)
				"src/middleware/**",
			],
			thresholds: {
				statements: 80,
				branches: 80,
				functions: 80,
				lines: 80,
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
