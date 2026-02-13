/**
 * Test data factories for creating mock entities
 * Each factory generates realistic test data with overridable fields
 *
 * Add your own entity factories here as you build features.
 */

// ============================================================================
// Base Utilities
// ============================================================================

let idCounter = 0;

/**
 * Generates a unique test UUID in valid UUID format
 */
export function generateTestId(): string {
	idCounter++;
	// Generate a valid UUIDv4 format with predictable test values
	const padded = idCounter.toString().padStart(4, "0");
	return `550e8400-e29b-41d4-a716-${padded}55440000`;
}

/**
 * Reset ID counter (call in beforeEach)
 */
export function resetIdCounter(): void {
	idCounter = 0;
}

/**
 * Common timestamp fields
 */
function getTimestamps(
	overrides: {
		created_at?: string;
		updated_at?: string;
		is_deleted?: boolean;
		deleted_at?: string | null;
	} = {},
) {
	return {
		created_at:
			overrides.created_at ?? new Date("2024-01-01T00:00:00Z").toISOString(),
		updated_at:
			overrides.updated_at ?? new Date("2024-01-01T00:00:00Z").toISOString(),
		is_deleted: overrides.is_deleted ?? false,
		deleted_at: overrides.deleted_at ?? null,
	};
}

// ============================================================================
// Category (Generic status/type category)
// ============================================================================

export interface TestCategory {
	id: string;
	category_type_id: string;
	label: string;
	key: string;
	color: string | null;
	is_active: boolean;
	sort_order: number | null;
	internal_notes: string | null;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	deleted_at: string | null;
}

export function createTestCategory(
	overrides: Partial<TestCategory> = {},
): TestCategory {
	const id = overrides.id ?? generateTestId();
	return {
		id,
		category_type_id: overrides.category_type_id ?? generateTestId(),
		label: overrides.label ?? "Test Category",
		key: overrides.key ?? "test_category",
		color: overrides.color ?? "#3b82f6",
		is_active: overrides.is_active ?? true,
		sort_order: overrides.sort_order ?? 1,
		internal_notes: overrides.internal_notes ?? null,
		...getTimestamps(overrides),
	};
}

// ============================================================================
// User (Generic user entity)
// ============================================================================

export interface TestUser {
	id: string;
	name: string | null;
	email: string;
	emailVerified: boolean;
	image: string | null;
	role: "user" | "admin";
	createdAt: Date;
	updatedAt: Date;
	banned: boolean | null;
	banReason: string | null;
	banExpires: Date | null;
}

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
	const id = overrides.id ?? generateTestId();
	return {
		id,
		name: overrides.name ?? "Test User",
		email: overrides.email ?? `user-${id.slice(-4)}@example.com`,
		emailVerified: overrides.emailVerified ?? true,
		image: overrides.image ?? null,
		role: overrides.role ?? "user",
		createdAt: overrides.createdAt ?? new Date("2024-01-01T00:00:00Z"),
		updatedAt: overrides.updatedAt ?? new Date("2024-01-01T00:00:00Z"),
		banned: overrides.banned ?? null,
		banReason: overrides.banReason ?? null,
		banExpires: overrides.banExpires ?? null,
	};
}

// ============================================================================
// Session (Auth session)
// ============================================================================

export interface TestSession {
	user: TestUser;
	session: {
		id: string;
		userId: string;
		createdAt: Date;
		updatedAt: Date;
		expiresAt: Date;
		token: string;
		ipAddress: string | null;
		userAgent: string | null;
		impersonatedBy: string | null;
	};
}

export function createTestSession(
	userOverrides: Partial<TestUser> = {},
	sessionOverrides: Partial<TestSession["session"]> = {},
): TestSession {
	const user = createTestUser(userOverrides);
	return {
		user,
		session: {
			id: sessionOverrides.id ?? generateTestId(),
			userId: user.id,
			createdAt: sessionOverrides.createdAt ?? new Date("2024-01-01T00:00:00Z"),
			updatedAt: sessionOverrides.updatedAt ?? new Date("2024-01-01T00:00:00Z"),
			expiresAt: sessionOverrides.expiresAt ?? new Date("2024-12-31T23:59:59Z"),
			token: sessionOverrides.token ?? `test-token-${generateTestId()}`,
			ipAddress: sessionOverrides.ipAddress ?? null,
			userAgent: sessionOverrides.userAgent ?? null,
			impersonatedBy: sessionOverrides.impersonatedBy ?? null,
		},
	};
}

// ============================================================================
// Client (Example entity - customize for your domain)
// ============================================================================

export interface TestClient {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	status_category_id: string;
	status_category?: TestCategory | null;
	internal_notes: string | null;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	deleted_at: string | null;
}

export function createTestClient(
	overrides: Partial<TestClient> = {},
): TestClient {
	const id = overrides.id ?? generateTestId();
	return {
		id,
		name: overrides.name ?? "Test Client",
		email: overrides.email ?? `client-${id.slice(-4)}@example.com`,
		phone: overrides.phone ?? "555-000-0000",
		status_category_id: overrides.status_category_id ?? generateTestId(),
		status_category: overrides.status_category ?? null,
		internal_notes: overrides.internal_notes ?? null,
		...getTimestamps(overrides),
	};
}

/**
 * Creates a client with an embedded status category
 */
export function createTestClientWithStatus(
	clientOverrides: Partial<TestClient> = {},
	categoryOverrides: Partial<TestCategory> = {},
): TestClient {
	const category = createTestCategory(categoryOverrides);
	return createTestClient({
		...clientOverrides,
		status_category_id: category.id,
		status_category: category,
	});
}
