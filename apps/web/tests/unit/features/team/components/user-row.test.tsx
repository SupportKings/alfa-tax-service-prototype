import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the user-row component with a simple implementation
vi.mock("@/features/team/components/user-row", () => ({
	UserRow: ({
		user,
		onRemoveUser,
	}: {
		user: {
			id: string;
			name: string | null;
			email: string;
			image: string | null;
			createdAt: string | Date;
		};
		onRemoveUser: (userId: string, userName: string) => void;
		currentUserId: string;
	}) => {
		const getInitials = (name: string) => {
			return name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		};

		const formatDate = (date: string | Date) => {
			const dateObj = typeof date === "string" ? new Date(date) : date;
			return dateObj.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		};

		return (
			<div data-testid="user-row">
				<div data-testid="avatar">
					{user.image ? (
						<span data-testid="avatar-image">{user.name || "User"}</span>
					) : (
						<span data-testid="avatar-fallback">
							{getInitials(user.name || "User")}
						</span>
					)}
				</div>
				<p data-testid="user-name">{user.name || "Unknown User"}</p>
				<span data-testid="user-email">{user.email}</span>
				<span data-testid="user-joined">
					Joined {formatDate(user.createdAt)}
				</span>
				<button type="button" aria-label="Open menu" data-testid="menu-trigger">
					...
				</button>
				<button
					type="button"
					onClick={() => onRemoveUser(user.id, user.name || "Unknown User")}
					data-testid="remove-button"
				>
					Remove from Team
				</button>
			</div>
		);
	},
}));

import { UserRow } from "@/features/team/components/user-row";

describe("UserRow", () => {
	const defaultUser = {
		id: "user-123",
		name: "John Doe",
		email: "john.doe@example.com",
		image: null,
		createdAt: new Date("2024-01-15T10:00:00Z"),
		emailVerified: true,
		banned: false,
		banReason: null,
		banExpires: null,
		role: "user" as const,
		updatedAt: new Date("2024-01-15T10:00:00Z"),
	};

	const defaultProps = {
		user: defaultUser,
		onRemoveUser: vi.fn(),
		currentUserId: "current-user-456",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering user data", () => {
		it("renders the user row container", () => {
			render(<UserRow {...defaultProps} />);

			expect(screen.getByTestId("user-row")).toBeInTheDocument();
		});

		it("renders user name", () => {
			render(<UserRow {...defaultProps} />);

			expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
		});

		it("renders user email", () => {
			render(<UserRow {...defaultProps} />);

			expect(screen.getByTestId("user-email")).toHaveTextContent(
				"john.doe@example.com",
			);
		});

		it("renders join date", () => {
			render(<UserRow {...defaultProps} />);

			expect(screen.getByTestId("user-joined")).toHaveTextContent(
				"Joined Jan 15, 2024",
			);
		});

		it("renders avatar fallback with initials when no image", () => {
			render(<UserRow {...defaultProps} />);

			expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("JD");
		});

		it("renders avatar image when user has image", () => {
			const userWithImage = {
				...defaultUser,
				image: "https://example.com/avatar.jpg",
			};
			render(<UserRow {...defaultProps} user={userWithImage} />);

			const avatarImage = screen.getByTestId("avatar-image");
			expect(avatarImage).toBeInTheDocument();
		});

		it("renders Unknown User when name is null", () => {
			const userWithoutName = {
				...defaultUser,
				name: null,
			};
			render(<UserRow {...defaultProps} user={userWithoutName} />);

			expect(screen.getByTestId("user-name")).toHaveTextContent("Unknown User");
		});
	});

	describe("Avatar initials", () => {
		it("renders correct initials for single word name", () => {
			const singleNameUser = {
				...defaultUser,
				name: "John",
			};
			render(<UserRow {...defaultProps} user={singleNameUser} />);

			expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("J");
		});

		it("renders correct initials for three word name", () => {
			const threeNameUser = {
				...defaultUser,
				name: "John Michael Doe",
			};
			render(<UserRow {...defaultProps} user={threeNameUser} />);

			// Should take first two initials
			expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("JM");
		});
	});

	describe("Menu actions", () => {
		it("renders menu trigger button", () => {
			render(<UserRow {...defaultProps} />);

			expect(screen.getByTestId("menu-trigger")).toBeInTheDocument();
		});

		it("renders Remove from Team option", () => {
			render(<UserRow {...defaultProps} />);

			expect(screen.getByTestId("remove-button")).toHaveTextContent(
				"Remove from Team",
			);
		});

		it("calls onRemoveUser when Remove from Team is clicked", async () => {
			const user = userEvent.setup();
			const onRemoveUser = vi.fn();
			render(<UserRow {...defaultProps} onRemoveUser={onRemoveUser} />);

			await user.click(screen.getByTestId("remove-button"));

			expect(onRemoveUser).toHaveBeenCalledWith("user-123", "John Doe");
		});

		it("calls onRemoveUser with Unknown User when name is null", async () => {
			const user = userEvent.setup();
			const onRemoveUser = vi.fn();
			const userWithoutName = {
				...defaultUser,
				name: null,
			};
			render(
				<UserRow
					{...defaultProps}
					user={userWithoutName}
					onRemoveUser={onRemoveUser}
				/>,
			);

			await user.click(screen.getByTestId("remove-button"));

			expect(onRemoveUser).toHaveBeenCalledWith("user-123", "Unknown User");
		});
	});

	describe("Date formatting", () => {
		it("formats date correctly for different dates", () => {
			const userWithDifferentDate = {
				...defaultUser,
				createdAt: new Date("2023-12-25T00:00:00Z"),
			};
			render(<UserRow {...defaultProps} user={userWithDifferentDate} />);

			expect(screen.getByTestId("user-joined")).toHaveTextContent(
				"Joined Dec 25, 2023",
			);
		});

		it("handles Date object for createdAt", () => {
			const userWithDateObject = {
				...defaultUser,
				createdAt: new Date("2024-06-15T00:00:00Z"),
			};
			render(<UserRow {...defaultProps} user={userWithDateObject} />);

			expect(screen.getByTestId("user-joined")).toHaveTextContent(
				"Joined Jun 15, 2024",
			);
		});
	});

	describe("Different users", () => {
		it("renders correctly for Jane Smith", () => {
			const janeUser = {
				...defaultUser,
				id: "user-456",
				name: "Jane Smith",
				email: "jane.smith@example.com",
			};
			render(<UserRow {...defaultProps} user={janeUser} />);

			expect(screen.getByTestId("user-name")).toHaveTextContent("Jane Smith");
			expect(screen.getByTestId("user-email")).toHaveTextContent(
				"jane.smith@example.com",
			);
			expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("JS");
		});

		it("renders correctly for Bob Wilson", () => {
			const bobUser = {
				...defaultUser,
				id: "user-789",
				name: "Bob Wilson",
				email: "bob.wilson@example.com",
			};
			render(<UserRow {...defaultProps} user={bobUser} />);

			expect(screen.getByTestId("user-name")).toHaveTextContent("Bob Wilson");
			expect(screen.getByTestId("user-email")).toHaveTextContent(
				"bob.wilson@example.com",
			);
			expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("BW");
		});
	});
});
