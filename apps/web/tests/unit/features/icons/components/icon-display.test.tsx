import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the icon registry
vi.mock("@/features/icons/data/icon-registry", () => ({
	getIconByKey: vi.fn((key: string) => {
		if (key === "star") {
			return {
				icon: ({ className }: { className?: string }) => (
					<svg data-testid="star-icon" className={className} />
				),
				name: "Star",
				keywords: ["favorite", "rating"],
			};
		}
		if (key === "heart") {
			return {
				icon: ({ className }: { className?: string }) => (
					<svg data-testid="heart-icon" className={className} />
				),
				name: "Heart",
				keywords: ["love", "health"],
			};
		}
		return null;
	}),
}));

import { IconDisplay } from "@/features/icons/components/icon-display";

describe("IconDisplay", () => {
	describe("Rendering with valid icon key", () => {
		it("renders the icon when valid iconKey is provided", () => {
			render(<IconDisplay iconKey="star" />);

			expect(screen.getByTestId("star-icon")).toBeInTheDocument();
		});

		it("renders different icons based on iconKey", () => {
			render(<IconDisplay iconKey="heart" />);

			expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
		});
	});

	describe("Rendering without icon key", () => {
		it("renders nothing when iconKey is undefined", () => {
			const { container } = render(<IconDisplay />);

			expect(container.firstChild).toBeNull();
		});

		it("renders fallback when iconKey is undefined and fallback is provided", () => {
			render(
				<IconDisplay fallback={<span data-testid="fallback">No icon</span>} />,
			);

			expect(screen.getByTestId("fallback")).toBeInTheDocument();
		});
	});

	describe("Rendering with invalid icon key", () => {
		it("renders nothing when iconKey is not found in registry", () => {
			const { container } = render(<IconDisplay iconKey="nonexistent" />);

			expect(container.firstChild).toBeNull();
		});

		it("renders fallback when iconKey is not found and fallback is provided", () => {
			render(
				<IconDisplay
					iconKey="nonexistent"
					fallback={<span data-testid="fallback">Default</span>}
				/>,
			);

			expect(screen.getByTestId("fallback")).toBeInTheDocument();
		});
	});

	describe("className prop", () => {
		it("applies default h-4 w-4 classes to icon", () => {
			render(<IconDisplay iconKey="star" />);

			const icon = screen.getByTestId("star-icon");
			expect(icon).toHaveClass("h-4", "w-4");
		});

		it("applies custom className to icon", () => {
			render(<IconDisplay iconKey="star" className="h-6 w-6 text-red-500" />);

			const icon = screen.getByTestId("star-icon");
			expect(icon).toHaveClass("h-6", "w-6", "text-red-500");
		});

		it("combines default and custom classes", () => {
			render(<IconDisplay iconKey="star" className="text-blue-500" />);

			const icon = screen.getByTestId("star-icon");
			expect(icon).toHaveClass("h-4", "w-4", "text-blue-500");
		});
	});

	describe("Fallback prop", () => {
		it("renders fallback component when provided and icon not found", () => {
			render(
				<IconDisplay
					iconKey="invalid"
					fallback={<span data-testid="custom-fallback">Custom Fallback</span>}
				/>,
			);

			expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
			expect(screen.getByText("Custom Fallback")).toBeInTheDocument();
		});

		it("does not render fallback when valid icon is found", () => {
			render(
				<IconDisplay
					iconKey="star"
					fallback={<span data-testid="fallback">Fallback</span>}
				/>,
			);

			expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();
			expect(screen.getByTestId("star-icon")).toBeInTheDocument();
		});

		it("renders null when no fallback and icon not found", () => {
			const { container } = render(<IconDisplay iconKey="invalid" />);

			expect(container.firstChild).toBeNull();
		});
	});
});
