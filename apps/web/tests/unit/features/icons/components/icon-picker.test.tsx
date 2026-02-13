import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock lucide-react icons - include all commonly used ones
vi.mock("lucide-react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("lucide-react")>();
	return {
		...actual,
		Check: ({ className }: { className?: string }) => (
			<svg data-testid="check-icon" className={className} />
		),
		SearchIcon: ({ className }: { className?: string }) => (
			<svg data-testid="search-icon" className={className} />
		),
	};
});

// Mock the icon registry with inline icon components
vi.mock("@/features/icons/data/icon-registry", () => {
	const mockStarIcon = ({ className }: { className?: string }) => (
		<svg data-testid="mock-star-icon" className={className} />
	);
	const mockHeartIcon = ({ className }: { className?: string }) => (
		<svg data-testid="mock-heart-icon" className={className} />
	);
	const mockZapIcon = ({ className }: { className?: string }) => (
		<svg data-testid="mock-zap-icon" className={className} />
	);

	const mockAllIcons: Array<
		[string, { icon: typeof mockStarIcon; name: string; keywords?: string[] }]
	> = [
		["star", { icon: mockStarIcon, name: "Star", keywords: ["favorite"] }],
		["heart", { icon: mockHeartIcon, name: "Heart", keywords: ["love"] }],
		["zap", { icon: mockZapIcon, name: "Zap", keywords: ["lightning"] }],
	];

	return {
		getAllIcons: vi.fn(() => mockAllIcons),
		searchIcons: vi.fn((query: string) => {
			const lowerQuery = query.toLowerCase();
			return mockAllIcons.filter(
				([key, item]) =>
					key.includes(lowerQuery) ||
					item.name.toLowerCase().includes(lowerQuery) ||
					item.keywords?.some((k) => k.includes(lowerQuery)),
			);
		}),
	};
});

import { IconPicker } from "@/features/icons/components/icon-picker";

describe("IconPicker", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders the picker trigger button", () => {
			render(<IconPicker />);

			expect(
				screen.getByRole("button", { name: /select icon/i }),
			).toBeInTheDocument();
		});

		it("renders default placeholder when no value selected", () => {
			render(<IconPicker />);

			expect(screen.getByText("Select icon...")).toBeInTheDocument();
		});

		it("renders custom placeholder when provided", () => {
			render(<IconPicker placeholder="Choose an icon" />);

			expect(screen.getByText("Choose an icon")).toBeInTheDocument();
		});

		it("renders custom children as trigger when provided", () => {
			render(
				<IconPicker>
					<button type="button" data-testid="custom-trigger">
						Custom Trigger
					</button>
				</IconPicker>,
			);

			expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
		});
	});

	describe("Opening the picker", () => {
		it("opens popover when trigger is clicked", async () => {
			const user = userEvent.setup();
			render(<IconPicker />);

			await user.click(screen.getByRole("button", { name: /select icon/i }));

			await waitFor(() => {
				expect(
					screen.getByPlaceholderText("Search icons..."),
				).toBeInTheDocument();
			});
		});

		it("displays icons when popover is open", async () => {
			const user = userEvent.setup();
			render(<IconPicker />);

			await user.click(screen.getByRole("button", { name: /select icon/i }));

			await waitFor(() => {
				expect(screen.getByTestId("mock-star-icon")).toBeInTheDocument();
				expect(screen.getByTestId("mock-heart-icon")).toBeInTheDocument();
				expect(screen.getByTestId("mock-zap-icon")).toBeInTheDocument();
			});
		});
	});

	describe("Icon selection", () => {
		it("calls onValueChange when an icon is selected", async () => {
			const onValueChange = vi.fn();
			const user = userEvent.setup();
			render(<IconPicker onValueChange={onValueChange} />);

			await user.click(screen.getByRole("button", { name: /select icon/i }));

			await waitFor(() => {
				expect(screen.getByTestId("mock-star-icon")).toBeInTheDocument();
			});

			// Click the star icon option using the option role
			const starOption = screen.getByRole("option", { name: /star/i });
			await user.click(starOption);

			expect(onValueChange).toHaveBeenCalledWith("star");
		});

		it("shows check mark for selected icon", async () => {
			const user = userEvent.setup();
			render(<IconPicker value="star" />);

			await user.click(screen.getByRole("button"));

			await waitFor(() => {
				expect(screen.getByTestId("check-icon")).toBeInTheDocument();
			});
		});

		it("displays selected icon name in trigger when value is set", () => {
			render(<IconPicker value="star" />);

			expect(screen.getByText("Star")).toBeInTheDocument();
		});
	});

	describe("Search functionality", () => {
		it("filters icons based on search query", async () => {
			const user = userEvent.setup();
			render(<IconPicker />);

			await user.click(screen.getByRole("button", { name: /select icon/i }));

			await waitFor(() => {
				expect(
					screen.getByPlaceholderText("Search icons..."),
				).toBeInTheDocument();
			});

			await user.type(screen.getByPlaceholderText("Search icons..."), "star");

			// searchIcons mock filters based on name/keywords
			await waitFor(() => {
				expect(screen.getByTestId("mock-star-icon")).toBeInTheDocument();
			});
		});

		it("shows empty state when no icons match search", async () => {
			const user = userEvent.setup();
			render(<IconPicker />);

			await user.click(screen.getByRole("button", { name: /select icon/i }));

			await waitFor(() => {
				expect(
					screen.getByPlaceholderText("Search icons..."),
				).toBeInTheDocument();
			});

			await user.type(
				screen.getByPlaceholderText("Search icons..."),
				"nonexistent",
			);

			await waitFor(() => {
				expect(screen.getByText("No icons found.")).toBeInTheDocument();
			});
		});
	});

	describe("Custom trigger className", () => {
		it("applies triggerClassName to default trigger", () => {
			render(<IconPicker triggerClassName="custom-class" />);

			const trigger = screen.getByRole("button", { name: /select icon/i });
			expect(trigger).toHaveClass("custom-class");
		});
	});

	describe("Accessibility", () => {
		it("has screen reader text for icon names", async () => {
			const user = userEvent.setup();
			render(<IconPicker />);

			await user.click(screen.getByRole("button", { name: /select icon/i }));

			await waitFor(() => {
				// Icons should have sr-only text with their names
				const srTexts = screen.getAllByText("Star");
				expect(srTexts.length).toBeGreaterThan(0);
			});
		});
	});
});
