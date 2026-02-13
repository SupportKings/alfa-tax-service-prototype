import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock kbar provider
const mockKBarProviderProps = vi.fn();

vi.mock("kbar", () => ({
	KBarProvider: ({
		children,
		actions,
		options,
	}: {
		children: React.ReactNode;
		actions: unknown[];
		options?: Record<string, unknown>;
	}) => {
		mockKBarProviderProps({ actions, options });
		return <div data-testid="kbar-provider">{children}</div>;
	},
}));

// Mock navigation actions
const mockNavigationActions = [
	{
		id: "dashboard",
		name: "Go to Dashboard",
		keywords: "dashboard inbox home",
		section: "Navigation",
		perform: vi.fn(),
	},
	{
		id: "settings",
		name: "Go to Settings",
		keywords: "settings profile",
		section: "Navigation",
		perform: vi.fn(),
	},
];

vi.mock("@/features/commandpallette/actions/navigation", () => ({
	useNavigationActions: () => mockNavigationActions,
}));

// Mock theme actions
const mockThemeActions = [
	{
		id: "theme",
		name: "Change theme",
		keywords: "theme dark light mode",
		section: "Preferences",
	},
	{
		id: "theme-light",
		name: "Light",
		keywords: "light theme",
		section: "Preferences",
		parent: "theme",
		perform: vi.fn(),
	},
	{
		id: "theme-dark",
		name: "Dark",
		keywords: "dark theme",
		section: "Preferences",
		parent: "theme",
		perform: vi.fn(),
	},
];

vi.mock("@/features/commandpallette/actions/theme", () => ({
	useThemeActions: () => mockThemeActions,
}));

import { CommandProvider } from "@/features/commandpallette/components/commandProvider";

describe("CommandProvider", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders children correctly", () => {
			render(
				<CommandProvider>
					<div data-testid="child-content">Test Content</div>
				</CommandProvider>,
			);

			expect(screen.getByTestId("child-content")).toBeInTheDocument();
			expect(screen.getByText("Test Content")).toBeInTheDocument();
		});

		it("wraps children with KBarProvider", () => {
			render(
				<CommandProvider>
					<div data-testid="child-content">Test Content</div>
				</CommandProvider>,
			);

			const provider = screen.getByTestId("kbar-provider");
			expect(provider).toBeInTheDocument();
			expect(provider).toContainElement(screen.getByTestId("child-content"));
		});

		it("renders multiple children", () => {
			render(
				<CommandProvider>
					<div data-testid="child-1">Child 1</div>
					<div data-testid="child-2">Child 2</div>
				</CommandProvider>,
			);

			expect(screen.getByTestId("child-1")).toBeInTheDocument();
			expect(screen.getByTestId("child-2")).toBeInTheDocument();
		});
	});

	describe("KBarProvider configuration", () => {
		it("passes combined actions to KBarProvider", () => {
			render(
				<CommandProvider>
					<div>Content</div>
				</CommandProvider>,
			);

			expect(mockKBarProviderProps).toHaveBeenCalled();
			const { actions } = mockKBarProviderProps.mock.calls[0][0];

			// Should have both navigation and theme actions
			const expectedLength =
				mockNavigationActions.length + mockThemeActions.length;
			expect(actions).toHaveLength(expectedLength);
		});

		it("includes navigation actions", () => {
			render(
				<CommandProvider>
					<div>Content</div>
				</CommandProvider>,
			);

			const { actions } = mockKBarProviderProps.mock.calls[0][0];

			// Check for navigation actions
			expect(actions).toContainEqual(
				expect.objectContaining({
					id: "dashboard",
					name: "Go to Dashboard",
					section: "Navigation",
				}),
			);
			expect(actions).toContainEqual(
				expect.objectContaining({
					id: "settings",
					name: "Go to Settings",
					section: "Navigation",
				}),
			);
		});

		it("includes theme actions", () => {
			render(
				<CommandProvider>
					<div>Content</div>
				</CommandProvider>,
			);

			const { actions } = mockKBarProviderProps.mock.calls[0][0];

			// Check for theme actions
			expect(actions).toContainEqual(
				expect.objectContaining({
					id: "theme",
					name: "Change theme",
					section: "Preferences",
				}),
			);
			expect(actions).toContainEqual(
				expect.objectContaining({
					id: "theme-light",
					name: "Light",
					parent: "theme",
				}),
			);
			expect(actions).toContainEqual(
				expect.objectContaining({
					id: "theme-dark",
					name: "Dark",
					parent: "theme",
				}),
			);
		});

		it("passes disableScrollbarManagement option", () => {
			render(
				<CommandProvider>
					<div>Content</div>
				</CommandProvider>,
			);

			const { options } = mockKBarProviderProps.mock.calls[0][0];

			expect(options).toEqual({
				disableScrollbarManagement: true,
			});
		});
	});

	describe("Actions order", () => {
		it("places navigation actions before theme actions", () => {
			render(
				<CommandProvider>
					<div>Content</div>
				</CommandProvider>,
			);

			const { actions } = mockKBarProviderProps.mock.calls[0][0];

			// Navigation actions should come first
			const dashboardIndex = actions.findIndex(
				(a: { id: string }) => a.id === "dashboard",
			);
			const themeIndex = actions.findIndex(
				(a: { id: string }) => a.id === "theme",
			);

			expect(dashboardIndex).toBeLessThan(themeIndex);
		});
	});

	describe("Hook integration", () => {
		it("uses useNavigationActions hook", () => {
			render(
				<CommandProvider>
					<div>Content</div>
				</CommandProvider>,
			);

			const { actions } = mockKBarProviderProps.mock.calls[0][0];

			// All navigation actions should be present
			for (const navAction of mockNavigationActions) {
				expect(actions).toContainEqual(expect.objectContaining(navAction));
			}
		});

		it("uses useThemeActions hook", () => {
			render(
				<CommandProvider>
					<div>Content</div>
				</CommandProvider>,
			);

			const { actions } = mockKBarProviderProps.mock.calls[0][0];

			// All theme actions should be present
			for (const themeAction of mockThemeActions) {
				expect(actions).toContainEqual(expect.objectContaining(themeAction));
			}
		});
	});
});
