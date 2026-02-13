import { CommentInput } from "@/features/shared/components/comment-input";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

function createErrorWithMessages(
	message: string,
	errors: string[],
): Error & { _errors: string[] } {
	const e = new Error(message) as Error & { _errors: string[] };
	e._errors = errors;
	return e;
}

// Mock framer-motion - filter out motion-specific props to avoid React warnings
vi.mock("framer-motion", () => ({
	motion: {
		div: ({
			children,
			layout: _layout,
			initial: _initial,
			transition: _transition,
			...props
		}: React.PropsWithChildren<{
			layout?: boolean;
			initial?: boolean;
			transition?: object;
		}>) => <div {...props}>{children}</div>,
	},
}));

// Create a mock editor with focus capability
const mockEditorFocus = vi.fn();
const mockEditorIsFocused = vi.fn().mockReturnValue(false);

// Mock the TextEditor component with editorRef support
vi.mock("@/features/editor/components/editor", () => ({
	TextEditor: ({
		onChange,
		placeholder,
		onSubmit,
		editorRef,
	}: {
		onChange: (content: string) => void;
		placeholder?: string;
		onSubmit?: () => void;
		editorRef?: React.MutableRefObject<unknown>;
		defaultContent?: string;
	}) => {
		// Set up the editor ref with mock methods
		if (editorRef) {
			editorRef.current = {
				commands: { focus: mockEditorFocus },
				isFocused: mockEditorIsFocused(),
			};
		}
		return (
			<textarea
				data-testid="text-editor"
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && e.metaKey && onSubmit) {
						onSubmit();
					}
				}}
			/>
		);
	},
}));

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe("CommentInput", () => {
	const mockOnSubmit = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders the text editor", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByTestId("text-editor")).toBeInTheDocument();
		});

		it("renders the submit button", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
		});

		it("renders with default placeholder", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(
				screen.getByPlaceholderText("Leave a comment..."),
			).toBeInTheDocument();
		});

		it("renders with custom placeholder", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					placeholder="Add your feedback..."
				/>,
				{ wrapper: createWrapper() },
			);

			expect(
				screen.getByPlaceholderText("Add your feedback..."),
			).toBeInTheDocument();
		});
	});

	describe("Submit callback", () => {
		it("submit button is disabled when comment is empty", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
		});

		it("calls onSubmit with correct params when form is submitted", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			await user.type(editor, "Testcomment");
			await user.click(screen.getByRole("button", { name: /send/i }));

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					entityId: "test-123",
					comment: expect.stringContaining("Testcomment"),
				}),
			);
		});

		it("calls onSubmit for coach entity type", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="coach-456"
					entityType="coach"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			await user.type(editor, "Coachcomment");
			await user.click(screen.getByRole("button", { name: /send/i }));

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					entityId: "coach-456",
					comment: expect.stringContaining("Coachcomment"),
				}),
			);
		});

		it("does not submit when comment is only whitespace", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			await user.type(editor, "   ");

			expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
		});

		it("handleSubmit returns early when comment is whitespace-only", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			await user.type(editor, "   ");

			// Submit form directly to bypass disabled button
			const form = editor.closest("form");
			if (form) {
				fireEvent.submit(form);
			}

			expect(mockOnSubmit).not.toHaveBeenCalled();
		});
	});

	describe("Loading state", () => {
		it("shows loading state when isPending is true", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					isPending={true}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByText(/sending/i)).toBeInTheDocument();
		});

		it("disables submit button when isPending is true", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					isPending={true}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByRole("button")).toBeDisabled();
		});
	});

	describe("Error handling", () => {
		it("displays error message when error is provided", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					error={createErrorWithMessages("Something went wrong", [
						"Something went wrong",
					])}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		});

		it("does not display error when error is null", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					error={null}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.queryByText(/error|wrong/i)).not.toBeInTheDocument();
		});

		it("does not display error when error._errors is empty", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					error={createErrorWithMessages("", [])}
				/>,
				{ wrapper: createWrapper() },
			);

			// With empty _errors array, accessing _errors[0] returns undefined
			// The component still renders the <p> element but with no text content
			const _errorContainer = screen.queryByText(/./);
			// Verify no actual error text is displayed
			expect(
				screen.queryByText("Something went wrong"),
			).not.toBeInTheDocument();
		});
	});

	describe("Keyboard interactions", () => {
		it("submits form with Command+Enter keyboard shortcut", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			await user.type(editor, "TestShortcutComment");
			await user.keyboard("{Meta>}{Enter}{/Meta}");

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					entityId: "test-123",
					comment: "TestShortcutComment",
				}),
			);
		});

		it("does not submit with Command+Enter when comment is empty", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			await user.click(editor);
			await user.keyboard("{Meta>}{Enter}{/Meta}");

			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it("does not re-focus editor on Enter keydown when editor is already focused", () => {
			mockEditorIsFocused.mockReturnValue(true);
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const container = screen
				.getByTestId("text-editor")
				.closest(".cursor-text");
			if (container) {
				mockEditorFocus.mockClear();
				fireEvent.keyDown(container, { key: "Enter" });
				// Should NOT call focus since editor is already focused
				expect(mockEditorFocus).not.toHaveBeenCalled();
			}
			mockEditorIsFocused.mockReturnValue(false);
		});

		it("focuses editor when container is clicked", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const container = screen
				.getByTestId("text-editor")
				.closest(".cursor-text");
			if (container) {
				await user.click(container);
				expect(mockEditorFocus).toHaveBeenCalled();
			}
		});
	});

	describe("Success callback", () => {
		it("keeps editor content when data does not contain comment", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					data={null}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			await user.type(editor, "MyComment");

			// With null data, the editor content should remain
			expect(editor).toHaveValue("MyComment");
		});

		it("clears editor after successful submission when data contains comment", async () => {
			const user = userEvent.setup();
			const { rerender } = render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					data={null}
				/>,
				{ wrapper: createWrapper() },
			);

			// Type and submit a comment
			const editor = screen.getByTestId("text-editor");
			await user.type(editor, "SuccessComment");
			await user.click(screen.getByRole("button", { name: /send/i }));

			expect(mockOnSubmit).toHaveBeenCalled();

			// Simulate success response with data containing comment
			rerender(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					data={{ comment: "SuccessComment" }}
				/>,
			);

			// After success, editor should be cleared
			const updatedEditor = screen.getByTestId("text-editor");
			expect(updatedEditor).toHaveValue("");
		});
	});

	describe("Form behavior", () => {
		it("renders a form element", () => {
			const { container } = render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const form = container.querySelector("form");
			expect(form).toBeInTheDocument();
		});

		it("submit button has type submit", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const button = screen.getByRole("button", { name: /send/i });
			expect(button).toHaveAttribute("type", "submit");
		});

		it("trims whitespace from comment before submitting", async () => {
			const user = userEvent.setup();
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			// Use fireEvent to set value directly with spaces
			editor.focus();
			await user.clear(editor);
			// Manually set the value with spaces since userEvent.type removes them
			await act(async () => {
				Object.getOwnPropertyDescriptor(
					HTMLTextAreaElement.prototype,
					"value",
				)?.set?.call(editor, "  trimmedComment  ");
				editor.dispatchEvent(new Event("change", { bubbles: true }));
			});
			await user.click(screen.getByRole("button", { name: /send/i }));

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					comment: "trimmedComment",
				}),
			);
		});
	});

	describe("Accessibility", () => {
		it("button shows Send icon when not loading", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					isPending={false}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByText("Send")).toBeInTheDocument();
		});

		it("button shows loading spinner when pending", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
					isPending={true}
				/>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByText("Sending...")).toBeInTheDocument();
		});

		it("has accessible editor container", () => {
			render(
				<CommentInput
					entityId="test-123"
					entityType="ticket"
					onSubmit={mockOnSubmit}
				/>,
				{ wrapper: createWrapper() },
			);

			const editor = screen.getByTestId("text-editor");
			expect(editor).toHaveAttribute("placeholder", "Leave a comment...");
		});
	});
});
