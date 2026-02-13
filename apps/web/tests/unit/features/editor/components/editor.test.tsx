import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock TipTap dependencies before importing the component
vi.mock("@tiptap/react", () => ({
	useEditor: vi.fn().mockReturnValue({
		chain: () => ({
			focus: () => ({
				toggleHeading: () => ({ run: vi.fn() }),
				toggleBold: () => ({ run: vi.fn() }),
				toggleItalic: () => ({ run: vi.fn() }),
				toggleStrike: () => ({ run: vi.fn() }),
				toggleHighlight: () => ({ run: vi.fn() }),
			}),
		}),
		isActive: vi.fn().mockReturnValue(false),
		getHTML: vi.fn().mockReturnValue("<p>Test content</p>"),
		on: vi.fn(),
		off: vi.fn(),
		destroy: vi.fn(),
	}),
	EditorContent: ({ editor }: { editor: unknown }) => (
		<div data-testid="editor-content">
			{editor ? "Editor loaded" : "No editor"}
		</div>
	),
}));

vi.mock("@tiptap/starter-kit", () => ({
	default: {
		configure: vi.fn().mockReturnValue({}),
	},
}));

vi.mock("@tiptap/extension-highlight", () => ({
	default: {},
}));

vi.mock("@tiptap/extension-text-align", () => ({
	default: {
		configure: vi.fn().mockReturnValue({}),
	},
}));

vi.mock("@tiptap/extensions", () => ({
	Placeholder: {
		configure: vi.fn().mockReturnValue({}),
	},
}));

vi.mock("@tiptap/react/menus", () => ({
	BubbleMenu: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="bubble-menu">{children}</div>
	),
}));

// Mock the EditorBubbleMenu component
vi.mock("@/features/editor/components/bubbleMenu", () => ({
	EditorBubbleMenu: ({ editor }: { editor: unknown }) => (
		<div data-testid="editor-bubble-menu">
			{editor ? "Bubble menu" : "No bubble menu"}
		</div>
	),
}));

import { TextEditor } from "@/features/editor/components/editor";

describe("TextEditor", () => {
	describe("Rendering", () => {
		it("renders the editor component", () => {
			render(<TextEditor />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("renders editor content when editor is available", () => {
			render(<TextEditor />);

			expect(screen.getByText("Editor loaded")).toBeInTheDocument();
		});

		it("renders bubble menu when editable is true", () => {
			render(<TextEditor editable={true} />);

			expect(screen.getByTestId("editor-bubble-menu")).toBeInTheDocument();
		});

		it("does not render bubble menu when editable is false", () => {
			render(<TextEditor editable={false} />);

			expect(
				screen.queryByTestId("editor-bubble-menu"),
			).not.toBeInTheDocument();
		});
	});

	describe("Props", () => {
		it("accepts defaultContent prop", () => {
			render(<TextEditor defaultContent="<p>Initial content</p>" />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("accepts placeholder prop", () => {
			render(<TextEditor placeholder="Write something..." />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("accepts onChange callback prop", () => {
			const onChange = vi.fn();
			render(<TextEditor onChange={onChange} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("accepts onSubmit callback prop", () => {
			const onSubmit = vi.fn();
			render(<TextEditor onSubmit={onSubmit} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("accepts editorRef prop", () => {
			const editorRef = { current: null };
			render(<TextEditor editorRef={editorRef} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});
	});

	describe("Editor wrapper", () => {
		it("renders with full width wrapper", () => {
			const { container } = render(<TextEditor />);

			const wrapper = container.querySelector(".w-full");
			expect(wrapper).toBeInTheDocument();
		});
	});
});
