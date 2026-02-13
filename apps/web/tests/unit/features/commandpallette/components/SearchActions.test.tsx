import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock kbar hooks
const mockUseRegisterActions = vi.fn();
vi.mock("kbar", () => ({
	useRegisterActions: (actions: unknown[], deps: unknown[]) => {
		mockUseRegisterActions(actions, deps);
	},
}));

// Mock the useDynamicSearch hook
const mockDynamicActions = [
	{
		id: "search-1",
		name: "Test Result",
		subtitle: "Test description",
		section: "Search Results",
		perform: vi.fn(),
	},
];

vi.mock("@/features/commandpallette/hooks/useDynamicSearch", () => ({
	useDynamicSearch: () => mockDynamicActions,
}));

import { SearchActions } from "@/features/commandpallette/components/SearchActions";

describe("SearchActions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders without crashing", () => {
			const { container } = render(<SearchActions />);

			// SearchActions returns null, so container should be empty
			expect(container.firstChild).toBeNull();
		});

		it("returns null (renders nothing visible)", () => {
			const { container } = render(<SearchActions />);

			expect(container.innerHTML).toBe("");
		});
	});

	describe("kbar integration", () => {
		it("calls useRegisterActions with dynamic actions", () => {
			render(<SearchActions />);

			expect(mockUseRegisterActions).toHaveBeenCalled();
			expect(mockUseRegisterActions).toHaveBeenCalledWith(mockDynamicActions, [
				mockDynamicActions,
			]);
		});

		it("registers actions with correct structure", () => {
			render(<SearchActions />);

			const registeredActions = mockUseRegisterActions.mock.calls[0][0];
			expect(registeredActions).toHaveLength(1);
			expect(registeredActions[0]).toEqual(
				expect.objectContaining({
					id: "search-1",
					name: "Test Result",
					subtitle: "Test description",
					section: "Search Results",
				}),
			);
		});

		it("passes actions array as dependency", () => {
			render(<SearchActions />);

			const deps = mockUseRegisterActions.mock.calls[0][1];
			expect(deps).toEqual([mockDynamicActions]);
		});
	});

	describe("Dynamic search hook integration", () => {
		it("uses useDynamicSearch hook to get actions", () => {
			render(<SearchActions />);

			// Verify useRegisterActions was called with the mocked dynamic actions
			const registeredActions = mockUseRegisterActions.mock.calls[0][0];
			expect(registeredActions).toBe(mockDynamicActions);
		});
	});
});
