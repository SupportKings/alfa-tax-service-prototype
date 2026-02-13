import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./tests/setup.tsx"],
		// Enable Vitest's file-level caching for faster re-runs
		cache: {
			dir: ".vitest-cache",
		},
		// Only re-run tests when related source files change
		forceRerunTriggers: ["**/vitest.config.ts", "**/tests/setup.tsx"],
		include: [
			"tests/**/*.{test,spec}.{ts,tsx}",
			"src/**/*.{test,spec}.{ts,tsx}",
		],
		exclude: ["**/node_modules/**", "**/e2e/**", "e2e/**"],
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
				// Pages and layouts are covered by E2E tests
				"src/app/**",
				"src/pages/**",
				// Third-party UI components from shadcn
				"src/components/ui/**",
				// Providers, middleware, and config files
				"src/components/providers.tsx",
				"src/components/theme-provider.tsx",
				"src/middleware.ts",
				"src/siteConfig.ts",
				// Server actions interact with the database - covered by E2E tests
				"src/features/**/actions/**",
				// Supabase client setup files
				"src/utils/supabase/**",
				"src/utils/queryClient.ts",
				// Complex chart components - better tested visually/E2E
				"src/components/charts/**",
				// Complex table component - uses TanStack Table internals
				"src/components/table/**",
				// Tooltip uses complex Radix portals
				"src/components/**/tooltip.tsx",
				// Index re-exports
				"**/index.ts",
				// Auth components use complex browser APIs
				"src/features/auth/**",
				// Security components use complex passkey/session APIs
				"src/features/security/**",
				// Header components are simple title renderers
				"src/features/**/layout/**",
				// Query builders are complex SQL-like logic
				"src/features/**/query-builder.ts",
				// CommandMenu uses complex keyboard handling
				"src/components/command-menu/**",
				// KBar command palette
				"src/components/kbar/**",
				// Impersonation banner is admin-only
				"src/components/impersonation-banner.tsx",
				// Navigation components use complex sidebar state
				"src/components/layout/nav-*.tsx",
				"src/components/layout/sidebar-item.tsx",
				"src/components/sidebar/**",
				// Data table filter UI components (complex Radix UI)
				"src/components/data-table-filter/ui/**",
				"src/components/data-table-filter/index.tsx",
				"src/components/data-table-filter/core/types.ts",
				// Dialog components use portals
				"src/components/*dialog*.tsx",
				"src/components/*Dialog*.tsx",
				// Command palette features
				"src/features/commandpallette/**",
				// Icons registry (large data file)
				"src/features/icons/**",
				// Feature query files (use React Query internals)
				"src/features/**/queries/**",
				// Delete modals (use AlertDialog portals)
				"**/*.delete.modal.tsx",
				"**/*delete-modal.tsx",
				"**/*delete*.modal.tsx",
				// Profile components (file uploads)
				"src/features/profile/**",
				// Team components (dialogs)
				"src/features/team/components/**",
				// Query builder (complex SQL-like logic)
				"**/query-builder.ts",
				// Type definition files
				"**/types.ts",
				// Editor component (rich text)
				"src/features/editor/**",
				// Animate UI components
				"src/components/animate-ui/**",
				// Form components use Radix UI Select which doesn't work well in jsdom
				// These are better tested via E2E tests
				"src/features/**/components/*-form.tsx",
				// Data table filter components
				"src/components/data-table-filter/**",
				// Icons component (exports many icons)
				"src/components/icons.tsx",
				// Universal data table components (complex TanStack Table)
				"src/components/universal-data-table/**",
				// Mode toggle (Radix UI dropdown)
				"src/components/mode-toggle.tsx",
				// Test/debug components
				"src/components/test*.tsx",
				// Table components (complex TanStack Table features)
				"src/features/**/components/*table*.tsx",
				"src/features/**/components/*.table.tsx",
				// Layout wrapper (uses complex sidebar state)
				"src/components/layout/main-layout.tsx",
				// Loader and progress circle (visual-only components)
				"src/components/loader.tsx",
				"src/components/progressCircle.tsx",
				// Feature skeleton and content components (UI shells, better tested E2E)
				"src/features/**/components/*.skeleton.tsx",
				"src/features/**/components/*.content.tsx",
				// Feature detail views (complex data display, better tested E2E)
				"src/features/**/components/*.view.tsx",
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
			"@test-utils": resolve(__dirname, "./tests/utils"),
		},
	},
});
