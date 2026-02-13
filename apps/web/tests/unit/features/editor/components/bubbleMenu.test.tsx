import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock TipTap BubbleMenu
vi.mock("@tiptap/react/menus", () => ({
	BubbleMenu: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="bubble-menu-wrapper">{children}</div>
	),
}));

// Mock base-ui-components
vi.mock("@base-ui-components/react/toggle", () => ({
	Toggle: ({
		children,
		...props
	}: { children: React.ReactNode } & Record<string, unknown>) => (
		<button type="button" {...props}>
			{children}
		</button>
	),
}));

vi.mock("@base-ui-components/react/toggle-group", () => ({
	ToggleGroup: ({
		children,
		...props
	}: { children: React.ReactNode } & Record<string, unknown>) => (
		<div {...props}>{children}</div>
	),
}));

vi.mock("@base-ui-components/react/toolbar", () => ({
	Toolbar: {
		Root: ({
			children,
			...props
		}: { children: React.ReactNode } & Record<string, unknown>) => (
			<div data-testid="toolbar-root" {...props}>
				{children}
			</div>
		),
		Button: ({
			children,
			render,
			...props
		}: {
			children: React.ReactNode;
			render?: React.ReactNode;
		} & Record<string, unknown>) => (
			<button type="button" {...props}>
				{children}
			</button>
		),
		Separator: (props: Record<string, unknown>) => (
			<div data-testid="toolbar-separator" {...props} />
		),
	},
}));

import { EditorBubbleMenu } from "@/features/editor/components/bubbleMenu";

describe("EditorBubbleMenu", () => {
	const createMockEditor = () => {
		const mockRun = vi.fn();
		const mockChain = vi.fn(() => ({
			focus: vi.fn(() => ({
				toggleHeading: vi.fn().mockReturnValue({ run: mockRun }),
				toggleBold: vi.fn().mockReturnValue({ run: mockRun }),
				toggleItalic: vi.fn().mockReturnValue({ run: mockRun }),
				toggleStrike: vi.fn().mockReturnValue({ run: mockRun }),
				toggleHighlight: vi.fn().mockReturnValue({ run: mockRun }),
			})),
		}));
		return {
			chain: mockChain,
			isActive: vi.fn().mockReturnValue(false),
		};
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("returns null when editor is null", () => {
			const { container } = render(<EditorBubbleMenu editor={null} />);

			expect(container.firstChild).toBeNull();
		});

		it("renders the bubble menu when editor is provided", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(screen.getByTestId("bubble-menu-wrapper")).toBeInTheDocument();
		});

		it("renders the toolbar root", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(screen.getByTestId("toolbar-root")).toBeInTheDocument();
		});
	});

	describe("Heading buttons", () => {
		it("renders H1 button", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(
				screen.getByRole("button", { name: /heading 1/i }),
			).toBeInTheDocument();
		});

		it("renders H2 button", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(
				screen.getByRole("button", { name: /heading 2/i }),
			).toBeInTheDocument();
		});

		it("renders H3 button", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(
				screen.getByRole("button", { name: /heading 3/i }),
			).toBeInTheDocument();
		});

		it("calls editor chain when H1 clicked", async () => {
			const user = userEvent.setup();
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			await user.click(screen.getByRole("button", { name: /heading 1/i }));

			// Verify the chain was called
			expect(mockEditor.chain).toHaveBeenCalled();
		});

		it("calls editor chain when H2 clicked", async () => {
			const user = userEvent.setup();
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			await user.click(screen.getByRole("button", { name: /heading 2/i }));

			expect(mockEditor.chain).toHaveBeenCalled();
		});

		it("calls editor chain when H3 clicked", async () => {
			const user = userEvent.setup();
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			await user.click(screen.getByRole("button", { name: /heading 3/i }));

			expect(mockEditor.chain).toHaveBeenCalled();
		});
	});

	describe("Text formatting buttons", () => {
		it("renders Bold button", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(
				screen.getByRole("button", { name: /^bold$/i }),
			).toBeInTheDocument();
		});

		it("renders Italic button", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(
				screen.getByRole("button", { name: /^italic$/i }),
			).toBeInTheDocument();
		});

		it("renders Strikethrough button", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(
				screen.getByRole("button", { name: /strikethrough/i }),
			).toBeInTheDocument();
		});

		it("renders Highlight button", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(
				screen.getByRole("button", { name: /highlight/i }),
			).toBeInTheDocument();
		});

		it("calls editor chain when Bold clicked", async () => {
			const user = userEvent.setup();
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			await user.click(screen.getByRole("button", { name: /^bold$/i }));

			expect(mockEditor.chain).toHaveBeenCalled();
		});

		it("calls editor chain when Italic clicked", async () => {
			const user = userEvent.setup();
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			await user.click(screen.getByRole("button", { name: /^italic$/i }));

			expect(mockEditor.chain).toHaveBeenCalled();
		});

		it("calls editor chain when Strikethrough clicked", async () => {
			const user = userEvent.setup();
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			await user.click(screen.getByRole("button", { name: /strikethrough/i }));

			expect(mockEditor.chain).toHaveBeenCalled();
		});

		it("calls editor chain when Highlight clicked", async () => {
			const user = userEvent.setup();
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			await user.click(screen.getByRole("button", { name: /highlight/i }));

			expect(mockEditor.chain).toHaveBeenCalled();
		});
	});

	describe("Toolbar separator", () => {
		it("renders separator between heading and formatting groups", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(screen.getByTestId("toolbar-separator")).toBeInTheDocument();
		});
	});

	describe("Active state", () => {
		it("checks isActive for heading level 1", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(mockEditor.isActive).toHaveBeenCalledWith("heading", { level: 1 });
		});

		it("checks isActive for bold", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(mockEditor.isActive).toHaveBeenCalledWith("bold");
		});

		it("checks isActive for italic", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(mockEditor.isActive).toHaveBeenCalledWith("italic");
		});

		it("checks isActive for strike", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(mockEditor.isActive).toHaveBeenCalledWith("strike");
		});

		it("checks isActive for highlight", () => {
			const mockEditor = createMockEditor();
			render(<EditorBubbleMenu editor={mockEditor as never} />);

			expect(mockEditor.isActive).toHaveBeenCalledWith("highlight");
		});
	});
});
