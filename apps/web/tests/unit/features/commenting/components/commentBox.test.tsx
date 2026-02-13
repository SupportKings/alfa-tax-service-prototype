import CommentBox from "@/features/commenting/components/commentBox";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("CommentBox", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders the comment box container", () => {
			render(<CommentBox />, { wrapper: createWrapper() });

			expect(
				screen.getByPlaceholderText("Leave a comment..."),
			).toBeInTheDocument();
		});

		it("renders the textarea for comment input", () => {
			render(<CommentBox />, { wrapper: createWrapper() });

			const textarea = screen.getByPlaceholderText("Leave a comment...");
			expect(textarea.tagName).toBe("TEXTAREA");
		});

		it("renders the submit button", () => {
			render(<CommentBox />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /submit comment/i }),
			).toBeInTheDocument();
		});

		it("renders the attach files button", () => {
			render(<CommentBox />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /attach images, files or videos/i }),
			).toBeInTheDocument();
		});
	});

	describe("User interaction", () => {
		it("allows typing in the textarea", async () => {
			const user = userEvent.setup();
			render(<CommentBox />, { wrapper: createWrapper() });

			const textarea = screen.getByPlaceholderText("Leave a comment...");
			await user.type(textarea, "This is a test comment");

			expect(textarea).toHaveValue("This is a test comment");
		});

		it("submit button is disabled when textarea is empty", () => {
			render(<CommentBox />, { wrapper: createWrapper() });

			const submitButton = screen.getByRole("button", {
				name: /submit comment/i,
			});
			expect(submitButton).toBeDisabled();
		});

		it("submit button is enabled when textarea has content", async () => {
			const user = userEvent.setup();
			render(<CommentBox />, { wrapper: createWrapper() });

			const textarea = screen.getByPlaceholderText("Leave a comment...");
			await user.type(textarea, "Some comment text");

			const submitButton = screen.getByRole("button", {
				name: /submit comment/i,
			});
			expect(submitButton).not.toBeDisabled();
		});

		it("clears textarea after clicking submit", async () => {
			const user = userEvent.setup();
			render(<CommentBox />, { wrapper: createWrapper() });

			const textarea = screen.getByPlaceholderText("Leave a comment...");
			await user.type(textarea, "Comment to submit");

			const submitButton = screen.getByRole("button", {
				name: /submit comment/i,
			});
			await user.click(submitButton);

			expect(textarea).toHaveValue("");
		});

		it("submit button remains disabled with only whitespace", async () => {
			const user = userEvent.setup();
			render(<CommentBox />, { wrapper: createWrapper() });

			const textarea = screen.getByPlaceholderText("Leave a comment...");
			await user.type(textarea, "   ");

			const submitButton = screen.getByRole("button", {
				name: /submit comment/i,
			});
			expect(submitButton).toBeDisabled();
		});

		it("does not clear textarea when handleSubmit is called with whitespace-only content", async () => {
			const user = userEvent.setup();
			render(<CommentBox />, { wrapper: createWrapper() });

			const textarea = screen.getByPlaceholderText("Leave a comment...");
			await user.type(textarea, "   ");

			// Force submit via form submission (bypasses disabled button)
			const form = textarea.closest("form");
			if (form) {
				form.dispatchEvent(
					new Event("submit", { bubbles: true, cancelable: true }),
				);
			}

			// Textarea should still have the whitespace (not cleared)
			expect(textarea).toHaveValue("   ");
		});
	});

	describe("Accessibility", () => {
		it("submit button has proper aria-label", () => {
			render(<CommentBox />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /submit comment/i }),
			).toBeInTheDocument();
		});

		it("attach button has proper aria-label", () => {
			render(<CommentBox />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /attach images, files or videos/i }),
			).toBeInTheDocument();
		});
	});
});
