import { Button } from "@/components/ui/button";

import { describe, expect, it } from "vitest";
import { render, screen } from "../../utils/test-utils";

describe("Button", () => {
	it("renders with default props", () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toBeInTheDocument();
	});

	it("renders with custom className", () => {
		render(<Button className="custom-class">Button</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("custom-class");
	});

	it("renders different variants", () => {
		const { rerender } = render(<Button variant="default">Default</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");

		rerender(<Button variant="destructive">Destructive</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button variant="outline">Outline</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button variant="secondary">Secondary</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button variant="ghost">Ghost</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button variant="link">Link</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders different sizes", () => {
		const { rerender } = render(<Button size="default">Default</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button size="sm">Small</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button size="lg">Large</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button size="icon">Icon</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("handles disabled state", () => {
		render(<Button disabled>Disabled</Button>);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
	});

	it("passes additional props to the button element", () => {
		render(<Button type="submit">Submit</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("type", "submit");
	});

	it("renders as child component when asChild is true", () => {
		render(
			<Button asChild>
				<a href="/test">Link Button</a>
			</Button>,
		);
		const link = screen.getByRole("link", { name: /link button/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/test");
	});
});
