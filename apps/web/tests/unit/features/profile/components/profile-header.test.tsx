import TeamHeader from "@/features/profile/components/layout/profile-header";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the SidebarTrigger component
vi.mock("@/components/ui/sidebar", () => ({
	SidebarTrigger: () => (
		<button type="button" data-testid="sidebar-trigger">
			Toggle Sidebar
		</button>
	),
}));

describe("TeamHeader (ProfileHeader)", () => {
	describe("Rendering", () => {
		it("renders the header component", () => {
			render(<TeamHeader />);

			expect(screen.getByText("Profile")).toBeInTheDocument();
		});

		it("renders the sidebar trigger", () => {
			render(<TeamHeader />);

			expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
		});
	});

	describe("Layout and styling", () => {
		it("renders with sticky positioning", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("sticky");
			expect(header).toHaveClass("top-0");
		});

		it("renders with proper height", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("h-[45px]");
		});

		it("renders with z-index for stacking", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("z-10");
		});

		it("renders with border at bottom", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("border-b");
		});

		it("renders with flex layout", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("flex");
			expect(header).toHaveClass("items-center");
			expect(header).toHaveClass("justify-between");
		});
	});

	describe("Title", () => {
		it("displays 'Profile' as the page title", () => {
			render(<TeamHeader />);

			const title = screen.getByRole("heading", { level: 1 });
			expect(title).toHaveTextContent("Profile");
		});

		it("renders title with proper font styling", () => {
			render(<TeamHeader />);

			const title = screen.getByRole("heading", { level: 1 });
			expect(title).toHaveClass("font-medium");
			expect(title).toHaveClass("text-[13px]");
		});
	});

	describe("Component structure", () => {
		it("groups sidebar trigger and title together", () => {
			const { container } = render(<TeamHeader />);

			// Find the flex container that groups the trigger and title
			const innerFlex = container.querySelector(".flex.items-center.gap-2");
			expect(innerFlex).toBeInTheDocument();
		});

		it("sidebar trigger appears before title in DOM order", () => {
			const { container } = render(<TeamHeader />);

			const innerContainer = container.querySelector(
				".flex.items-center.gap-2",
			);
			const children = innerContainer?.children;

			expect(children).toBeDefined();
			expect(children?.length).toBeGreaterThanOrEqual(2);
			// First child should be the sidebar trigger (button)
			expect(children?.[0].tagName.toLowerCase()).toBe("button");
			// Second child should be the heading
			expect(children?.[1].tagName.toLowerCase()).toBe("h1");
		});
	});

	describe("Responsive padding", () => {
		it("has padding for mobile view", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("px-4");
			expect(header).toHaveClass("py-2");
		});

		it("has increased padding for desktop view", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("lg:px-6");
		});
	});

	describe("Shrink behavior", () => {
		it("prevents header from shrinking in flex containers", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("flex-shrink-0");
		});
	});

	describe("Border styling", () => {
		it("uses border color from theme", () => {
			const { container } = render(<TeamHeader />);

			const header = container.firstChild as HTMLElement;
			expect(header).toHaveClass("border-border");
		});
	});

	describe("Accessibility", () => {
		it("has proper heading structure", () => {
			render(<TeamHeader />);

			const heading = screen.getByRole("heading", { level: 1 });
			expect(heading).toBeInTheDocument();
		});

		it("sidebar trigger is a button", () => {
			render(<TeamHeader />);

			const trigger = screen.getByTestId("sidebar-trigger");
			expect(trigger.tagName.toLowerCase()).toBe("button");
		});
	});
});
