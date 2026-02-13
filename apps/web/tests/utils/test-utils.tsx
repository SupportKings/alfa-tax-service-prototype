import type { ReactElement, ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";

// Create a new QueryClient for each test to prevent state leakage
function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

interface AllProvidersProps {
	children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps) {
	const queryClient = createTestQueryClient();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

function customRender(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) {
	return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";

// Override render with our custom render
export { customRender as render };

// Helper to create a wrapper with custom providers
export function createWrapper() {
	const queryClient = createTestQueryClient();
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};
}
