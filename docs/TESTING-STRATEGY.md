# Testing Strategy

> **Last Updated:** Run `bun test:stats` to update coverage statistics below.

## Current Coverage Status

<!-- COVERAGE_START -->
**Last Updated:** Feb 3, 2026 at 12:15 PM

### Unit Test Coverage (Vitest)

| App | Statements | Branches | Functions | Lines | Test Files | Tests | Status |
|-----|------------|----------|-----------|-------|------------|-------|--------|
| **Web** | 96.56% | 91.95% | 98.27% | 98.45% | 43 | 667 | Above 80% |
| **Server** | 100% | 100% | 100% | 100% | 6 | 18 | 100% |

### E2E Tests (Playwright)

| App | Spec Files | Tests | Passed | Failed | Status |
|-----|------------|-------|--------|--------|--------|
| **Web** | 3 | ? | ? | ? | Not run |

### Summary

| Metric | Count |
|--------|-------|
| **Total Unit Tests** | 685 |
| **Total E2E Tests** | 0 |
| **Total Tests** | 685 |
<!-- COVERAGE_END -->

---

## 1. Repository Overview

This is a **Bun-based monorepo** with 3 workspaces:

| Workspace | Description | Port | Testing |
|-----------|-------------|------|---------|
| `apps/web` | Next.js frontend | 3001 | Vitest + Playwright |
| `apps/server` | Hono + tRPC backend | 4000 | Vitest |
| `packages/emails` | React Email templates | 3002 | None (preview only) |

---

## 2. Testing Philosophy

### What We Unit Test (High ROI)
These are tested with Vitest because they're isolated, pure, and provide fast feedback:

| Category | Location | Coverage Goal | Why |
|----------|----------|---------------|-----|
| **Utilities** | `src/lib/*` | 100% | Pure functions, easy to test |
| **Hooks** | `src/hooks/*` | 100% | Reusable logic, well-isolated |
| **Icons** | `src/icons/*` | 100% | Simple components |
| **Permissions** | `src/lib/permissions.ts` | 100% | Critical business logic |
| **Schema Validation** | `**/types/*.ts` | High | Zod schemas catch bugs early |

### What We E2E Test (Complex Interactions)
These are tested with Playwright because they require real browser behavior:

| Category | Why E2E |
|----------|---------|
| **Server Actions** | Database interactions, auth, revalidation |
| **Full User Flows** | Create/edit/delete workflows |
| **Form Submissions** | Radix UI Select doesn't work in jsdom |
| **Navigation** | App Router, redirects, protected routes |
| **Auth Flows** | Session management, cookies |

### What We Don't Unit Test (Excluded)
These are excluded from unit test coverage for good reasons:

| Category | Location | Reason |
|----------|----------|--------|
| **Pages** | `src/app/**` | Covered by E2E |
| **Server Actions** | `src/features/**/actions/**` | DB interactions, use E2E |
| **UI Components** | `src/components/ui/**` | shadcn/ui, already tested |
| **Complex Tables** | `**/components/*table*.tsx` | TanStack Table internals |
| **Complex Forms** | `**/components/*-form.tsx` | Radix UI Select issues |
| **Dialogs** | `**/*dialog*.tsx` | Portal-based, use E2E |
| **Auth Components** | `src/features/auth/**` | Browser APIs |
| **Security** | `src/features/security/**` | Passkey APIs |
| **Editor** | `src/features/editor/**` | Rich text (Tiptap) |

---

## 3. Test Structure

### Web App (`apps/web`)

```
tests/
├── setup.tsx                    # Global mocks (Radix, Next.js, etc.)
├── unit/
│   ├── components/              # Component tests
│   ├── features/                # Feature tests (mirrors src/features/)
│   ├── hooks/                   # Custom hook tests
│   ├── icons/                   # Icon component tests
│   ├── lib/                     # Utility tests
│   └── queries/                 # Global query tests
├── utils/                       # Test helpers
│   ├── component-factories.ts   # Test data generators
│   ├── mock-auth.ts             # Auth mocking
│   ├── mock-db.ts               # Database mocking
│   ├── mock-trpc.ts             # tRPC mocking
│   ├── query-test-utils.tsx     # React Query helpers
│   └── test-utils.tsx           # General utilities
└── e2e/                         # Playwright E2E tests
```

---

## 4. Coverage Thresholds

Both apps enforce **80% minimum coverage**:

```typescript
// vitest.config.ts
thresholds: {
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80,
}
```

---

## 5. Testing Commands

### Quick Reference

```bash
# Run all tests (both apps)
bun test

# Generate coverage stats and update this document
bun test:stats

# Web app specific
cd apps/web
bun test              # Watch mode
bun test:run          # Single run
bun test:coverage     # With coverage
bun test:ui           # Vitest UI
bun test:e2e          # Playwright
bun test:e2e:ui       # Playwright UI mode

# Server app specific
cd apps/server
bun test              # Watch mode
bun test:run          # Single run
bun test:coverage     # With coverage
```

---

## 6. Writing Tests

### Unit Test Example (Hook)

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

// Mock the data fetching function
vi.mock("@/queries/getUser", () => ({
  getUser: vi.fn(),
}));

import { useUser } from "@/hooks/useUser";
import { getUser } from "@/queries/getUser";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useUser", () => {
  it("returns user data on success", async () => {
    vi.mocked(getUser).mockResolvedValue({ id: "1", name: "John" });

    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: "1", name: "John" });
    });
  });
});
```

### Unit Test Example (Component)

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<MyComponent onClick={onClick} />);
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalled();
  });
});
```

### Schema Validation Test

```typescript
import { describe, expect, it } from "vitest";
import { createEntitySchema } from "@/features/entity/types";

describe("createEntitySchema", () => {
  it("validates correct input", () => {
    const input = {
      name: "Test Entity",
      status_category_id: "status-1",
    };

    expect(createEntitySchema.safeParse(input).success).toBe(true);
  });

  it("rejects invalid input", () => {
    const input = {
      name: "", // empty
      status_category_id: "status-1",
    };

    const result = createEntitySchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
```

---

## 7. Test Data Factories

Use `tests/utils/component-factories.ts` to generate test data:

```typescript
import {
  createTestUser,
  createTestClient,
  createTestCategory,
} from "@test-utils/component-factories";

// Create test data with defaults
const user = createTestUser();

// Override specific fields
const customUser = createTestUser({
  id: "user-123",
  name: "John Smith",
  email: "john@example.com",
});
```

---

## 8. CI/CD Integration

Tests run automatically on every push and PR:

| Job | Trigger | Description |
|-----|---------|-------------|
| **Quality** | All PRs & pushes | Biome lint + TypeScript check |
| **Unit Tests** | All PRs & pushes | Vitest with coverage (enforces 80% threshold) |
| **E2E Tests** | All PRs & pushes | Playwright (Chromium) |
| **Build** | After unit tests pass | Full production build |

### Pipeline Flow

```
Quality ─┬─> Unit Tests ──> Build
         └─> E2E Tests (parallel, non-blocking)
```

---

## 9. Quick Links

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)
