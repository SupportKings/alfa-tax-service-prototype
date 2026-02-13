# Agent Skills & Guidelines

> This document defines agent capabilities, skills, and workflows for AI-assisted development on this template.

---

## TDD Protocol (MANDATORY)

**Every code change MUST follow Test-Driven Development. No exceptions.**

### The TDD Loop

```
1. RED    → Write a failing test that defines the expected behavior
2. GREEN  → Write the minimum code to make the test pass
3. REFACTOR → Clean up while keeping tests green
```

### Enforcement Rules

1. **Tests FIRST, always.** Before writing any implementation code, write the test file. The test must fail before you write the implementation.
2. **No untested code ships.** Every new function, route, component, and schema must have a corresponding test. CI enforces 80% coverage thresholds — PRs that drop below this are blocked.
3. **Run tests after every change.** After implementing, run `bun test:run` to confirm all tests pass. Never push code without verifying.
4. **Copy the example.** For new tRPC routers, copy `apps/server/src/routers/example.ts` and `apps/server/tests/unit/routers/example.test.ts` as your starting point.
5. **Schema tests are non-negotiable.** Every Zod schema MUST have validation tests (valid input, invalid input, edge cases). These are the highest ROI tests.

### TDD Checklist for New Features

| Step | Action | Verify |
|------|--------|--------|
| 1 | Write Zod schema tests | `bun test:run` — tests fail (RED) |
| 2 | Create Zod schemas | `bun test:run` — schema tests pass (GREEN) |
| 3 | Write router/action tests | `bun test:run` — tests fail (RED) |
| 4 | Implement router/action | `bun test:run` — all tests pass (GREEN) |
| 5 | Write component tests | `bun test:run` — tests fail (RED) |
| 6 | Create components | `bun test:run` — all pass (GREEN) |
| 7 | Run coverage check | `bun test:coverage` — above 80% |
| 8 | Run lint | `bunx biome check --write <changed-files>` |

### What MUST Be Tested

| Layer | Test Type | Example |
|-------|-----------|---------|
| Zod schemas | Unit | Valid/invalid input, edge cases |
| tRPC routers | Unit | Each procedure with mock context |
| Server actions | Unit | Input validation, auth checks, error paths |
| Pure components | Unit | Rendering, props, interactions |
| Hooks | Unit | Return values, state changes |
| Error utilities | Unit | `safeError()`, `logError()` behavior |

### What Should Be E2E Only

- Form components with Radix UI Select
- Table components with TanStack Table
- Dialog/modal components (portal-based)
- Full page flows (auth, navigation)

---

## Agent Roles

### 1. Code Agent (Primary)
**Purpose**: Implement features, fix bugs — always test-first

**Skills:**
- Feature implementation following `/docs/claude/feature-patterns.md`
- Component creation with shadcn/ui patterns
- tRPC router and procedure creation
- Database schema modifications with Drizzle
- Server Actions with Zod validation
- React Query hook creation

**Constraints:**
- **Write tests BEFORE implementation (TDD)**
- Never use `any` types (Biome enforces as error)
- Always validate with Zod schemas
- Follow existing patterns in codebase
- Run `bun biome check apps/web/src/path` after changes
- Use `safeError()` / `logError()` from `@/lib/errors` for error handling

---

### 2. Test Agent
**Purpose**: Write tests FIRST, maintain test quality

**Skills:**
- Unit tests with Vitest + React Testing Library
- E2E tests with Playwright
- Integration tests for tRPC procedures
- Mock creation for auth, database, external services

**TDD Responsibility:** The Test Agent writes tests BEFORE the Code Agent implements. This is the standard workflow — never reverse it.

**Patterns:**

```typescript
// Schema test (always write first — highest ROI)
import { createExampleSchema } from "@/features/foo/types";
describe("createExampleSchema", () => {
  it("validates correct input", () => {
    expect(createExampleSchema.safeParse({ name: "Test" }).success).toBe(true);
  });
  it("rejects empty name", () => {
    expect(createExampleSchema.safeParse({ name: "" }).success).toBe(false);
  });
});
```

```typescript
// tRPC router test (copy from tests/unit/routers/example.test.ts)
vi.mock("../../../src/lib/trpc", () => ({
  publicProcedure: {
    query: vi.fn((handler) => ({ _def: { query: true }, handler })),
    mutation: vi.fn((handler) => ({ _def: { mutation: true }, handler })),
    input: vi.fn(() => ({
      query: vi.fn((handler) => ({ _def: { query: true }, handler })),
      mutation: vi.fn((handler) => ({ _def: { mutation: true }, handler })),
    })),
  },
  router: vi.fn((routes) => routes),
}));
```

```typescript
// E2E test pattern
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/auth/sign-in')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

### 3. Documentation Agent
**Purpose**: Maintain and improve documentation

**Skills:**
- Update PROJECT_OVERVIEW.md after major changes
- Create feature-specific documentation
- Update API documentation
- Maintain CHANGELOG.md

**Auto-Documentation Protocol:**
- **Tier 1 (Silent)**: Update docs automatically for major changes
- **Tier 2 (Prompted)**: Ask before updating on uncertain completion

---

### 4. Review Agent
**Purpose**: Code review and quality assurance

**Skills:**
- TypeScript type correctness validation
- Pattern compliance checking
- Security vulnerability detection
- Performance anti-pattern identification

**Checklist:**
- [ ] No `any` types
- [ ] Proper error handling
- [ ] Zod validation on inputs
- [ ] Server Components used where possible
- [ ] Proper loading/error states
- [ ] Accessible markup (semantic HTML)

---

## Skill Definitions

### Skill: Build CRUD Screen
**Trigger**: "Build CRUD for [X]", "Create list/detail pages for [X]"

**Steps:**
1. **Read `/docs/CRUD-SCREENS.md`** - Complete guide with all patterns
2. Follow the feature structure exactly
3. Add `aria-label` to all icon-only buttons (critical for E2E)
4. Handle null values with `?? ""` in edit mode
5. Write tests for view mode, edit mode, and null branches
6. Run `bun test:coverage` - verify above 80%

**Critical Patterns:**
- Details component: view/edit modes with null handling
- Accessibility: `aria-label` on icon buttons for E2E testability
- Testing: cover null coalescing and early return branches

---

### Skill: Create Feature
**Trigger**: "Create a new feature for [X]"

**Steps (TDD order):**
1. Read `/docs/claude/feature-patterns.md` and `/docs/CRUD-SCREENS.md`
2. Create feature folder structure:
   ```
   /apps/web/src/features/[feature-name]/
   ├── actions/
   ├── components/
   ├── hooks/
   ├── layout/
   ├── queries/
   ├── types/
   └── utilities/
   ```
3. **Write Zod schema tests** → then create types with Zod schemas
4. **Write tRPC router tests** (copy `example.test.ts`) → then create router
5. **Write hook tests** → then create React Query hooks
6. **Write component tests** → then create components
7. Create page in `/apps/web/src/app/`
8. Update navigation if needed
9. Run `bun test:coverage` — verify above 80%

---

### Skill: Add tRPC Endpoint
**Trigger**: "Add API endpoint for [X]"

**Steps (TDD order):**
1. **Copy** `apps/server/src/routers/example.ts` → rename to your entity
2. **Copy** `apps/server/tests/unit/routers/example.test.ts` → rename
3. **Write tests first** — define expected inputs/outputs
4. Run tests — they should FAIL (RED)
5. Implement router procedures (replace TODO comments with real Drizzle queries)
6. Run tests — they should PASS (GREEN)
7. Merge router into `apps/server/src/routers/index.ts`
8. Create React Query hook in `/apps/web/src/queries/`

**Reference Implementation:** See `apps/server/src/routers/example.ts` for full CRUD pattern with Zod validation.

---

### Skill: Add Database Table
**Trigger**: "Add database table for [X]"

**Steps:**
1. Create schema in `/apps/server/src/db/schema/`
2. Export from `/apps/server/src/db/schema/index.ts`
3. Run `bun db:generate` to create migration
4. Run `bun db:push` to apply
5. Create corresponding Zod schemas
6. Update API types if needed

**Pattern:**
```typescript
// Schema
export const examples = pgTable('examples', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

---

### Skill: Add Component
**Trigger**: "Create component for [X]"

**Steps:**
1. Check if shadcn/ui has similar component
2. If yes, use/extend existing component
3. If no, create in feature's `/components/` folder
4. Use Server Component by default
5. Add `'use client'` only if needed (forms, interactions)
6. Follow patterns in `/docs/claude/ui-ux-standards.md`

---

### Skill: Fix Bug
**Trigger**: "Fix bug in [X]" or error message

**Steps:**
1. Read `/docs/claude/debug.md`
2. Identify 5-7 possible sources
3. Investigate most likely first
4. Find root cause (not symptoms)
5. Implement minimal fix
6. Verify fix doesn't break other things
7. Add test if applicable

---

### Skill: Add Test
**Trigger**: "Add tests for [X]"

**Steps:**
1. Identify test type needed (unit/integration/E2E)
2. Create test file in appropriate location
3. Write tests following patterns above (see TDD Protocol section)
4. Run tests: `bun test:run` — verify they fail first (RED), then pass (GREEN)
5. Run `bun test:coverage` — verify above 80%
6. Use `safeError()` / `logError()` for error handling in tested code

---

### Skill: Test Zod Schema (Highest ROI)
**Trigger**: "Test schema", "Validate types", "Schema validation tests"

**Why:** Schema tests are the highest ROI - they catch bugs early and are trivial to write.

**Pattern:**
```typescript
import { describe, expect, it } from "vitest";
import { createEntitySchema, updateEntitySchema } from "../types";

describe("createEntitySchema", () => {
  it("validates correct input", () => {
    const input = {
      name: "Valid Name",
      email: "test@example.com",
      status: "active",
    };
    expect(createEntitySchema.safeParse(input).success).toBe(true);
  });

  it("rejects empty name", () => {
    const input = { name: "", email: "test@example.com" };
    const result = createEntitySchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects invalid email", () => {
    const input = { name: "Test", email: "not-an-email" };
    expect(createEntitySchema.safeParse(input).success).toBe(false);
  });

  it("accepts optional fields as undefined", () => {
    const input = { name: "Test" };  // email is optional
    expect(createEntitySchema.safeParse(input).success).toBe(true);
  });

  it("coerces string to number for numeric fields", () => {
    const input = { name: "Test", amount: "100" };
    const result = createEntitySchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(100);
    }
  });
});
```

---

### Skill: Test Component with React Testing Library
**Trigger**: "Test component", "Component unit test", "Test UI"

**Setup:**
```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
```

**Pattern - View Component:**
```typescript
import { EntityDetails } from "../entity-details";
import { createTestEntity } from "@test-utils/component-factories";

describe("EntityDetails", () => {
  const mockEntity = createTestEntity();

  it("renders entity name", () => {
    render(<EntityDetails entity={mockEntity} />);
    expect(screen.getByText(mockEntity.name)).toBeInTheDocument();
  });

  it("renders fallback for null values", () => {
    const entityWithNulls = createTestEntity({ email: null });
    render(<EntityDetails entity={entityWithNulls} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<EntityDetails entity={mockEntity} onEdit={onEdit} />);
    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(onEdit).toHaveBeenCalled();
  });
});
```

**Pattern - Form Component:**
```typescript
describe("EntityForm", () => {
  it("submits with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<EntityForm onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Test");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Test" })
      );
    });
  });

  it("shows validation error for empty required field", async () => {
    const user = userEvent.setup();

    render(<EntityForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
```

---

### Skill: Test Custom Hook
**Trigger**: "Test hook", "Hook unit test", "Test useX"

**Pattern:**
```typescript
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Create wrapper for React Query hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useEntity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading state initially", () => {
    const { result } = renderHook(() => useEntity("123"), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("returns data on success", async () => {
    vi.mocked(fetchEntity).mockResolvedValue({ id: "123", name: "Test" });

    const { result } = renderHook(() => useEntity("123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: "123", name: "Test" });
    });
  });

  it("returns error on failure", async () => {
    vi.mocked(fetchEntity).mockRejectedValue(new Error("Not found"));

    const { result } = renderHook(() => useEntity("123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});
```

---

### Skill: Mock External Dependencies
**Trigger**: "Mock API", "Mock database", "Mock clipboard", "Mock toast"

**Common Mocks:**

```typescript
// Mock clipboard
const writeText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, { clipboard: { writeText } });

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({ id: "test-id" }),
  usePathname: () => "/dashboard/entities",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch/API
vi.mock("@/queries/getEntity", () => ({
  getEntity: vi.fn(),
}));

// Mock auth
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: { user: { id: "user-1", email: "test@example.com" } },
      isPending: false,
    }),
  },
}));

// Mock server action
vi.mock("../actions/createEntity", () => ({
  createEntity: vi.fn(),
}));
```

---

### Skill: Write Integration Test for tRPC Router
**Trigger**: "Test router", "Test API endpoint", "Integration test"

**Pattern:**
```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the tRPC internals
vi.mock("../../../src/lib/trpc", () => ({
  publicProcedure: {
    query: vi.fn((handler) => ({ _def: { query: true }, handler })),
    mutation: vi.fn((handler) => ({ _def: { mutation: true }, handler })),
    input: vi.fn(() => ({
      query: vi.fn((handler) => ({ _def: { query: true }, handler })),
      mutation: vi.fn((handler) => ({ _def: { mutation: true }, handler })),
    })),
  },
  router: vi.fn((routes) => routes),
}));

import { entityRouter } from "../../../src/routers/entity";

describe("entityRouter", () => {
  const mockCtx = {
    db: {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    },
  };

  describe("list", () => {
    it("returns all entities", async () => {
      const entities = [{ id: "1", name: "Test" }];
      mockCtx.db.returning.mockResolvedValue(entities);

      const result = await entityRouter.list.handler({ ctx: mockCtx });

      expect(result).toEqual(entities);
    });
  });

  describe("create", () => {
    it("creates entity with valid input", async () => {
      const input = { name: "New Entity" };
      const created = { id: "new-1", ...input };
      mockCtx.db.returning.mockResolvedValue([created]);

      const result = await entityRouter.create.handler({
        ctx: mockCtx,
        input,
      });

      expect(result).toEqual(created);
    });
  });
});
```

---

### Skill: TDD New Feature (Full Workflow)
**Trigger**: "TDD feature", "Build feature with tests", "Test-first development"

**Complete TDD Workflow:**

```
1. TYPES & SCHEMAS (Red → Green)
   └── Write schema tests → Create schemas → Tests pass

2. API/ROUTER (Red → Green)
   └── Write router tests → Implement router → Tests pass

3. HOOKS (Red → Green)
   └── Write hook tests → Create hooks → Tests pass

4. COMPONENTS (Red → Green)
   └── Write component tests → Build components → Tests pass

5. COVERAGE CHECK
   └── Run bun test:coverage → Verify above 80%
```

**Example: Adding "Comments" Feature**

```bash
# Step 1: Create test files first (they will fail)
touch apps/web/tests/unit/features/comments/types.test.ts
touch apps/server/tests/unit/routers/comments.test.ts
touch apps/web/tests/unit/features/comments/components/comment-list.test.ts

# Step 2: Write failing tests
# Step 3: Implement to make tests pass
# Step 4: Refactor while keeping green

# Step 5: Verify
bun test:run
bun test:coverage
```

**Key TDD Principles:**
- Never write implementation before a failing test
- Write the simplest code to pass the test
- Refactor only when tests are green
- Each test should test ONE behavior
- Tests should be independent (no shared state)

---

### Skill: Increase Test Coverage
**Trigger**: "Increase coverage", "Hit coverage threshold", "Cover uncovered branches"

**Steps:**
1. Run `bun test:coverage` to identify uncovered lines/branches
2. Focus on these high-value targets:
   - **Null coalescing branches**: `value ?? ""` - test with both null and valid values
   - **Early returns**: `if (!value) return` - test with falsy inputs
   - **Conditional rendering**: test both truthy and falsy conditions
   - **Error handlers**: mock failures to hit catch blocks
3. For each uncovered branch, write a test that exercises it
4. Use `vi.fn()` to mock clipboard, toast, and external APIs

**Coverage Priorities:**
```
1. Zod schemas (highest ROI)
2. Pure functions and utilities
3. Hooks with business logic
4. Component view/edit mode branches
5. Error handling paths
```

**Common Uncovered Patterns:**
```typescript
// Test with null to cover ?? branch
const entity = createTestEntity({ email: null });

// Test clipboard with mock
const writeText = vi.fn();
Object.assign(navigator, { clipboard: { writeText } });

// Test early return
render(<Component value={null} />);  // hits the guard clause
```

---

### Skill: Add E2E Tests
**Trigger**: "Add E2E test for [X]", "Test user flow for [X]"

**Steps:**
1. Create test file in `apps/web/e2e/[feature].spec.ts`
2. Use proper selectors (priority order):
   - `getByRole("button", { name: "..." })` - best, uses accessible name
   - `getByText("...")` - good for static content
   - `getByTestId("...")` - fallback for complex scenarios
3. Wait for network idle before assertions
4. Use `expect(...).toBeVisible({ timeout: 15000 })` for dynamic content

**Pattern:**
```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/feature");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });
  });

  test("can perform action", async ({ page }) => {
    await page.getByRole("button", { name: /action/i }).click();
    await expect(page.getByText("Success")).toBeVisible();
  });
});
```

**Critical:** Components must have `aria-label` on icon-only buttons for E2E testability!

---

### Skill: Make Components E2E Testable
**Trigger**: "E2E test can't find button", "Add accessibility", "Fix E2E selector"

**Steps:**
1. Add `aria-label` to all icon-only buttons:
```typescript
// Before (E2E can't find reliably)
<Button onClick={onRemove}>
  <X className="size-4" />
</Button>

// After (E2E uses getByRole("button", { name: "Remove" }))
<Button onClick={onRemove} aria-label="Remove">
  <X className="size-4" />
</Button>
```

2. Add `aria-label` to buttons with hidden text:
```typescript
<Button aria-label="Clear filters">
  <FilterXIcon />
  <span className="hidden md:inline">Clear</span>
</Button>
```

3. Add `data-testid` for complex selectors:
```typescript
<div data-testid="entity-card-{entity.id}">...</div>
```

---

### Skill: Debug CI Failures
**Trigger**: "CI is failing", "Build fails in CI", "Tests pass locally but fail in CI"

**Common Issues & Fixes:**

1. **Case-sensitive imports** (Linux CI is case-sensitive, macOS isn't):
```typescript
// BAD - works on macOS, fails on Linux
import { Icon } from "@/icons/CollapsibleIcon";  // file is collapsibleIcon.tsx

// GOOD
import { Icon } from "@/icons/collapsibleIcon";
```

2. **Missing environment variables:**
```yaml
# CI needs secrets configured in GitHub Settings → Secrets → Actions
- name: Build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    BETTER_AUTH_SECRET: ${{ secrets.BETTER_AUTH_SECRET }}
```

3. **Lockfile issues:**
```bash
# Regenerate lockfile locally and commit
bun install
git add bun.lock
git commit -m "chore: Update lockfile"
```

4. **TypeScript errors not caught locally:**
```bash
# Run full type check
bun check-types
```

5. **E2E tests fail - element not found:**
   - Add `aria-label` to icon-only buttons
   - Increase timeouts for dynamic content
   - Use `waitForLoadState("networkidle")`

---

### Skill: Set Up CI/CD Workflow
**Trigger**: "Set up CI", "Configure GitHub Actions", "Add deployment workflow"

**Best Practices:**

1. **Path-based filtering** - only run relevant jobs:
```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      web: ${{ steps.filter.outputs.web }}
    steps:
      - uses: dorny/paths-filter@v3
        with:
          filters: |
            web:
              - 'apps/web/**'
              - 'packages/**'
```

2. **Comprehensive caching:**
```yaml
- name: Cache Bun
  uses: actions/cache@v4
  with:
    path: |
      ~/.bun/install/cache
      node_modules
      apps/*/node_modules
    key: bun-${{ runner.os }}-${{ hashFiles('**/bun.lock') }}

- name: Cache Turbo
  uses: actions/cache@v4
  with:
    path: .turbo
    key: turbo-${{ runner.os }}-${{ github.sha }}

- name: Cache Playwright
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('**/bun.lock') }}
```

3. **Fail-fast secret validation:**
```yaml
- name: Check required secrets
  run: |
    missing=""
    if [ -z "${{ secrets.BETTER_AUTH_SECRET }}" ]; then missing="$missing BETTER_AUTH_SECRET"; fi
    if [ -n "$missing" ]; then
      echo "❌ Missing secrets:$missing"
      exit 1
    fi
```

4. **Deploy after CI passes** (not duplicate checks):
```yaml
on:
  workflow_run:
    workflows: ["CI"]
    branches: [main]
    types: [completed]
```

---

### Skill: Handle Null Values in Components
**Trigger**: "Uncontrolled input warning", "Cannot read property of null", "Handle optional fields"

**Patterns:**

1. **Form state initialization:**
```typescript
// BAD - causes uncontrolled input warning
const [name, setName] = useState(entity.name);

// GOOD - always use empty string fallback
const [name, setName] = useState(entity.name ?? "");
```

2. **Guard clauses for handlers:**
```typescript
// BAD - crashes if entity.id is null
const handleCopy = () => {
  navigator.clipboard.writeText(entity.id);
};

// GOOD - early return
const handleCopy = () => {
  if (!entity.id) return;
  navigator.clipboard.writeText(entity.id);
};
```

3. **Display fallbacks:**
```typescript
// Show dash for null values
<LabelValueItem label="Email" value={entity.email ?? "-"} />

// Conditional rendering
{entity.email ? (
  <a href={`mailto:${entity.email}`}>{entity.email}</a>
) : (
  <span className="text-muted-foreground">Not provided</span>
)}
```

---

## UI/UX Skills

### Skill: Build Form with shadcn/ui
**Trigger**: "Create form", "Add form for [X]", "Build input form"

**Pattern:**
```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  status: z.enum(["active", "inactive"]),
});

export function EntityForm({ onSubmit, defaultValues }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      status: defaultValues?.status ?? "active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
```

**Key Points:**
- Always use `react-hook-form` with `zodResolver`
- Default values must use `?? ""` for strings
- Use `FormMessage` for validation errors
- Disable submit button while submitting

---

### Skill: Add Loading States
**Trigger**: "Add loading state", "Show skeleton", "Loading UI"

**Patterns:**

1. **Skeleton Component:**
```typescript
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EntitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
```

2. **Suspense Boundary:**
```typescript
import { Suspense } from "react";
import { EntitySkeleton } from "./entity-skeleton";
import { EntityContent } from "./entity-content";

export default function EntityPage() {
  return (
    <Suspense fallback={<EntitySkeleton />}>
      <EntityContent />
    </Suspense>
  );
}
```

3. **Button Loading:**
```typescript
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? "Saving..." : "Save"}
</Button>
```

---

### Skill: Add Error States
**Trigger**: "Handle errors", "Show error message", "Error UI"

**Patterns:**

1. **Form Error:**
```typescript
{form.formState.errors.root && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {form.formState.errors.root.message}
    </AlertDescription>
  </Alert>
)}
```

2. **Query Error:**
```typescript
const { data, error, isError } = useQuery(...);

if (isError) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error instanceof Error ? error.message : "Something went wrong"}
      </AlertDescription>
    </Alert>
  );
}
```

3. **Toast for Mutations:**
```typescript
import { toast } from "sonner";

const mutation = useMutation({
  onSuccess: () => {
    toast.success("Entity created successfully");
  },
  onError: (error) => {
    toast.error(error instanceof Error ? error.message : "Failed to create");
  },
});
```

---

### Skill: Build Data Table
**Trigger**: "Create table", "List view", "Data table"

**Pattern:**
```typescript
"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/entities/${row.original.id}`}>
          View
        </Link>
      </Button>
    ),
  },
];

export function EntityTable({ data }: { data: Entity[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

### Skill: Add Confirmation Dialog
**Trigger**: "Confirm delete", "Confirmation modal", "Are you sure dialog"

**Pattern:**
```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteButton({ onDelete, entityName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      toast.success(`${entityName} deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {entityName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Database & Backend Skills

### Skill: Set Up Local Postgres with Supabase
**Trigger**: "Set up database", "Local Supabase", "Start Postgres"

**Steps:**

1. **Install Supabase CLI:**
```bash
brew install supabase/tap/supabase
```

2. **Initialize Supabase:**
```bash
cd apps/web  # or wherever supabase folder should be
supabase init
```

3. **Start Local Supabase:**
```bash
supabase start
```
This starts:
- Postgres on `localhost:54322`
- Studio on `localhost:54323`
- API on `localhost:54321`

4. **Get Connection String:**
```bash
supabase status
# Copy the DB URL for .env
```

5. **Configure .env:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<from supabase status>"
```

6. **Stop/Reset:**
```bash
supabase stop        # Stop all services
supabase db reset    # Reset database to clean state
```

**Common Issues:**
- Port conflict: `supabase stop --no-backup` then restart
- Docker not running: Start Docker Desktop first

---

### Skill: Create Database Schema with Drizzle
**Trigger**: "Add table", "Create schema", "Database model"

**Pattern:**
```typescript
// apps/server/src/db/schema/entities.ts
import { pgTable, text, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

// Enum
export const statusEnum = pgEnum("status", ["active", "inactive", "pending"]);

// Table
export const entities = pgTable("entities", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email"),
  status: statusEnum("status").default("active").notNull(),
  amount: integer("amount").default(0),
  isActive: boolean("is_active").default(true),

  // Foreign key
  categoryId: text("category_id").references(() => categories.id),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const entitiesRelations = relations(entities, ({ one, many }) => ({
  category: one(categories, {
    fields: [entities.categoryId],
    references: [categories.id],
  }),
  items: many(items),
}));

// Types
export type Entity = typeof entities.$inferSelect;
export type NewEntity = typeof entities.$inferInsert;
```

**Export from index:**
```typescript
// apps/server/src/db/schema/index.ts
export * from "./entities";
```

**Apply Changes:**
```bash
bun db:generate  # Generate migration
bun db:push      # Apply to database
```

---

### Skill: Write Drizzle Queries
**Trigger**: "Query database", "Drizzle select", "Database query"

**Patterns:**

1. **Select All:**
```typescript
const entities = await db.select().from(entitiesTable);
```

2. **Select with Filter:**
```typescript
import { eq, and, or, like, gt, lt, desc, asc } from "drizzle-orm";

const entity = await db
  .select()
  .from(entitiesTable)
  .where(eq(entitiesTable.id, id))
  .limit(1);

// Multiple conditions
const filtered = await db
  .select()
  .from(entitiesTable)
  .where(
    and(
      eq(entitiesTable.status, "active"),
      like(entitiesTable.name, `%${search}%`)
    )
  )
  .orderBy(desc(entitiesTable.createdAt));
```

3. **Select with Relations:**
```typescript
const entitiesWithCategory = await db.query.entities.findMany({
  with: {
    category: true,
    items: true,
  },
  where: eq(entitiesTable.status, "active"),
});
```

4. **Insert:**
```typescript
const [newEntity] = await db
  .insert(entitiesTable)
  .values({
    name: input.name,
    email: input.email,
    status: input.status,
  })
  .returning();
```

5. **Update:**
```typescript
const [updated] = await db
  .update(entitiesTable)
  .set({
    name: input.name,
    updatedAt: new Date(),
  })
  .where(eq(entitiesTable.id, id))
  .returning();
```

6. **Delete:**
```typescript
await db
  .delete(entitiesTable)
  .where(eq(entitiesTable.id, id));
```

---

### Skill: Create tRPC Router with Drizzle
**Trigger**: "Add API", "Create router", "tRPC endpoint"

**Pattern:**
```typescript
// apps/server/src/routers/entities.ts
import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../lib/trpc";
import { entities } from "../db/schema";

export const entitiesRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(entities);
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [entity] = await ctx.db
        .select()
        .from(entities)
        .where(eq(entities.id, input.id))
        .limit(1);

      if (!entity) {
        throw new Error("Entity not found");
      }

      return entity;
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      status: z.enum(["active", "inactive"]).default("active"),
    }))
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(entities)
        .values(input)
        .returning();

      return created;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(entities)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(entities.id, id))
        .returning();

      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(entities)
        .where(eq(entities.id, input.id));

      return { success: true };
    }),
});
```

**Register Router:**
```typescript
// apps/server/src/routers/index.ts
import { router } from "../lib/trpc";
import { entitiesRouter } from "./entities";

export const appRouter = router({
  entities: entitiesRouter,
});
```

---

### Skill: Run Database Migrations
**Trigger**: "Run migration", "Apply schema", "Database changes"

**Commands:**
```bash
# Generate migration from schema changes
bun db:generate

# Apply migrations to database
bun db:migrate

# Push schema directly (dev only, no migration file)
bun db:push

# Open Drizzle Studio
bun db:studio

# Reset database (careful!)
supabase db reset
```

**Migration Workflow:**
1. Modify schema in `apps/server/src/db/schema/`
2. Run `bun db:generate` to create migration
3. Review migration file in `supabase/migrations/`
4. Run `bun db:migrate` to apply
5. Test with `bun db:studio`

---

### Skill: Configure Supabase for Production
**Trigger**: "Deploy Supabase", "Production database", "Supabase project"

**Steps:**

1. **Create Supabase Project:**
   - Go to supabase.com
   - Create new project
   - Note the project URL and anon key

2. **Get Connection String:**
   - Project Settings → Database → Connection string
   - Use "URI" format for `DATABASE_URL`

3. **Update Environment:**
```bash
# Production .env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
```

4. **Run Migrations:**
```bash
# Link to remote project
supabase link --project-ref [PROJECT_REF]

# Push migrations to production
supabase db push
```

5. **Set GitHub Secrets:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL` (for migrations)

---

## Command Reference

### Development
```bash
bun dev              # Start all apps
bun dev:web          # Start web only (port 3001)
bun dev:server       # Start server only (port 3000)
```

### Database
```bash
bun db:push          # Push schema changes
bun db:studio        # Open Drizzle Studio
bun db:migrate       # Run migrations
bun db:generate      # Generate migration files
```

### Quality
```bash
bun check-types                        # Type check all apps
bun biome check apps/web/src/path      # Check specific path
bun biome check --apply apps/web/src   # Auto-fix issues
```

### Testing (after setup)
```bash
bun test             # Run all tests
bun test:unit        # Run unit tests
bun test:e2e         # Run E2E tests
bun test:coverage    # Run with coverage
```

---

## Constraints & Rules

### Never Do
- Write implementation code before writing tests
- Use `any` types (Biome enforces as error — build will fail)
- Skip Zod validation on user inputs
- Log raw error objects — use `safeError()` / `logError()` from `@/lib/errors`
- Create API routes (use tRPC)
- Nest `<ul>` inside `<p>`
- Use `Object.assign()` (use spread)
- Run `bun check` globally (memory issues)
- Create new files when editing existing works
- Add features not explicitly requested
- Push code without running `bun test:run`

### Always Do
- **Write tests FIRST** (TDD — Red, Green, Refactor)
- Copy from example router/tests when creating new CRUD features
- Read relevant file before editing
- Use existing patterns from codebase
- Validate inputs with Zod
- Use `safeError()` / `logError()` for error handling
- Use Server Components by default
- Add `type="button"` to non-submit buttons
- Follow import ordering (Biome handles)
- Use semantic HTML elements
- Handle loading and error states
- Run `bun test:coverage` before considering work complete

---

## MCP Integration

### Available Tools (when configured)
- `mcp__supabase__execute_sql` - Run SQL queries
- `mcp__supabase__list_tables` - List database tables
- `mcp__supabase__select` - Query data

### Setup
1. Copy `.mcp.json.example` to `.mcp.json`
2. Set `SUPABASE_ACCESS_TOKEN` environment variable
3. Restart Claude Code

---

## Context Files

### Always Read First
- `/CLAUDE.md` - Primary guidelines
- `/docs/claude/architecture.md` - System design
- `/docs/claude/code-quality.md` - Code standards

### Read When Relevant
- `/docs/CRUD-SCREENS.md` - **Complete CRUD screen patterns** (accessibility, testing, pitfalls)
- `/docs/claude/feature-patterns.md` - Creating features
- `/docs/claude/data-fetching.md` - Query patterns
- `/docs/claude/ui-ux-standards.md` - Component patterns
- `/docs/claude/troubleshooting.md` - Common issues
- `/docs/claude/common-mistakes.md` - Anti-patterns

---

## Workflow: Implementing a Task (TDD)

```mermaid
graph TD
    A[Receive Task] --> B[Read CLAUDE.md + AGENTS.md]
    B --> C{Understand Scope?}
    C -->|No| D[Read relevant docs]
    D --> C
    C -->|Yes| E[Plan Implementation]
    E --> F[Read existing code + example router]
    F --> G[Write tests FIRST]
    G --> H[Run tests — must FAIL]
    H --> I[Implement minimum code]
    I --> J[Run tests — must PASS]
    J --> K{All green?}
    K -->|No| L[Fix implementation]
    L --> J
    K -->|Yes| M[Run type check]
    M --> N[Run biome check]
    N --> O[Run coverage check]
    O --> P{Above 80%?}
    P -->|No| Q[Add missing tests]
    Q --> J
    P -->|Yes| R[Update docs if needed]
    R --> S[Done]
```

---

## Error Handling

### TypeScript Errors
1. Read error message carefully
2. Check if type is imported correctly
3. Verify type matches expected shape
4. Never use `as any` to silence errors

### Biome Errors
1. Run `bun biome check --apply` for auto-fix
2. For manual fixes, see `/docs/claude/linting-errors.md`
3. Import ordering is automatic

### Runtime Errors
1. Check browser console
2. Check server logs
3. Verify environment variables
4. Check database connection

---

*Last Updated: 2026-02-03*
