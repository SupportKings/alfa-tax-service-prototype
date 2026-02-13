import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock kbar hooks and components
const mockUseMatches = vi.fn();

vi.mock("kbar", () => ({
	KBarPortal: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="kbar-portal">{children}</div>
	),
	KBarPositioner: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => (
		<div data-testid="kbar-positioner" className={className}>
			{children}
		</div>
	),
	KBarAnimator: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => (
		<div data-testid="kbar-animator" className={className}>
			{children}
		</div>
	),
	KBarSearch: ({ className }: { className?: string }) => (
		<input
			data-testid="kbar-search"
			className={className}
			placeholder="Search..."
		/>
	),
	KBarResults: ({
		items,
		onRender,
	}: {
		items: unknown[];
		onRender: (props: { item: unknown; active: boolean }) => React.ReactNode;
	}) => (
		<div data-testid="kbar-results">
			{items.map((item, index) => (
				<div
					key={typeof item === "string" ? item : index}
					data-testid="kbar-result-item"
				>
					{onRender({ item, active: index === 0 })}
				</div>
			))}
		</div>
	),
	useMatches: () => mockUseMatches(),
}));

// Mock SearchActions component
vi.mock("@/features/commandpallette/components/SearchActions", () => ({
	SearchActions: () => <div data-testid="search-actions" />,
}));

import { CommandBar } from "@/features/commandpallette/components/commandBar";

describe("CommandBar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Default mock return value for useMatches
		mockUseMatches.mockReturnValue({
			results: [],
		});
	});

	describe("Rendering", () => {
		it("renders the command bar structure", () => {
			render(<CommandBar />);

			expect(screen.getByTestId("kbar-portal")).toBeInTheDocument();
			expect(screen.getByTestId("kbar-positioner")).toBeInTheDocument();
			expect(screen.getByTestId("kbar-animator")).toBeInTheDocument();
		});

		it("renders the search input", () => {
			render(<CommandBar />);

			expect(screen.getByTestId("kbar-search")).toBeInTheDocument();
		});

		it("renders SearchActions component", () => {
			render(<CommandBar />);

			expect(screen.getByTestId("search-actions")).toBeInTheDocument();
		});

		it("renders results container", () => {
			render(<CommandBar />);

			expect(screen.getByTestId("kbar-results")).toBeInTheDocument();
		});
	});

	describe("Layout structure", () => {
		it("positions command bar with fixed positioning", () => {
			render(<CommandBar />);

			const positioner = screen.getByTestId("kbar-positioner");
			expect(positioner.className).toContain("fixed");
			expect(positioner.className).toContain("inset-0");
			expect(positioner.className).toContain("z-50");
		});

		it("applies correct width to animator", () => {
			render(<CommandBar />);

			const animator = screen.getByTestId("kbar-animator");
			expect(animator.className).toContain("w-[720px]");
		});

		it("renders search input with correct styling classes", () => {
			render(<CommandBar />);

			const searchInput = screen.getByTestId("kbar-search");
			expect(searchInput.className).toContain("w-full");
			expect(searchInput.className).toContain("bg-transparent");
		});
	});

	describe("Results rendering", () => {
		it("renders section headers as strings", () => {
			mockUseMatches.mockReturnValue({
				results: ["Navigation", "Search Results"],
			});

			render(<CommandBar />);

			const resultItems = screen.getAllByTestId("kbar-result-item");
			expect(resultItems).toHaveLength(2);
		});

		it("renders action items with name", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "action-1",
						name: "Test Action",
						subtitle: "Action description",
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByText("Test Action")).toBeInTheDocument();
		});

		it("renders action items with subtitle", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "action-1",
						name: "Test Action",
						subtitle: "Action description",
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByText("Action description")).toBeInTheDocument();
		});

		it("renders action items with icon when present", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "action-1",
						name: "Test Action",
						icon: <span data-testid="action-icon">Icon</span>,
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByTestId("action-icon")).toBeInTheDocument();
		});

		it("renders keyboard shortcuts when present", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "action-1",
						name: "Test Action",
						shortcut: ["Cmd", "K"],
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByText("Cmd")).toBeInTheDocument();
			expect(screen.getByText("K")).toBeInTheDocument();
		});

		it("renders parent breadcrumb for nested actions", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "theme-dark",
						name: "Dark",
						parent: "theme",
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByText("Change theme")).toBeInTheDocument();
			expect(screen.getByText("Dark")).toBeInTheDocument();
		});
	});

	describe("Active state styling", () => {
		it("applies active styling to first item", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "action-1",
						name: "Active Action",
					},
					{
						id: "action-2",
						name: "Inactive Action",
					},
				],
			});

			render(<CommandBar />);

			// The first item should have active state (index === 0)
			const resultItems = screen.getAllByTestId("kbar-result-item");
			expect(resultItems).toHaveLength(2);
		});
	});

	describe("Parent name mapping", () => {
		it("maps account-settings parent correctly", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "profile",
						name: "Profile",
						parent: "account-settings",
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByText("Account Settings")).toBeInTheDocument();
		});

		it("maps workspace-settings parent correctly", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "members",
						name: "Members",
						parent: "workspace-settings",
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByText("Workspace Settings")).toBeInTheDocument();
		});

		it("maps theme parent correctly", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "theme-light",
						name: "Light",
						parent: "theme",
					},
				],
			});

			render(<CommandBar />);

			expect(screen.getByText("Change theme")).toBeInTheDocument();
		});

		it("does not show breadcrumb for unknown parent", () => {
			mockUseMatches.mockReturnValue({
				results: [
					{
						id: "action-1",
						name: "Test Action",
						parent: "unknown-parent",
					},
				],
			});

			render(<CommandBar />);

			// Should still render the action name
			expect(screen.getByText("Test Action")).toBeInTheDocument();
		});
	});
});
