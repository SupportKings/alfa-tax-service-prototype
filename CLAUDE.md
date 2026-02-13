# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Quick Reference

| Item | Value |
|------|-------|
| Runtime | **Bun 1.2.13+** (npm/pnpm blocked) |
| Web App | http://localhost:3001 |
| Server | http://localhost:4000 |
| Emails | http://localhost:3002 |

### Tech Stack
Next.js 15 • React 19 • Better Auth • Supabase • Drizzle ORM • tRPC • TailwindCSS v4 • Biome • Turborepo

## Essential Commands

```bash
# Development
bun dev              # All apps
bun dev:web          # Web only
bun dev:server       # Server only

# Testing
bun test             # Run all tests
bun test:unit        # Unit tests only
bun test:e2e         # E2E tests (Playwright)
bun test:coverage    # With coverage

# Database
bun db:push          # Push schema
bun db:studio        # Drizzle Studio
bun db:migrate       # Run migrations

# Quality
bun check-types      # TypeScript check
bun test:stats       # Update coverage in TESTING-STRATEGY.md
bunx biome check --write <file>  # Lint specific file
```

> ⚠️ **Never run** `bun check` or `bunx biome check .` globally - causes timeouts
> ⚠️ **ALWAYS use `bunx` instead of `npx`** - This is a Bun project!

## Project Structure

```
/apps
  /web              → Next.js (port 3001)
  /server           → Hono + tRPC (port 4000)
/packages/emails    → React Email (port 3002)
/docs               → API.md, DATABASE.md
/docs/claude        → Detailed documentation
```

## Critical Rules

### Code Standards
- **TypeScript**: No `any`, interfaces over types
- **Components**: Server by default, `'use client'` when needed
- **Formatting**: Tabs, double quotes, semicolons (Biome enforced)
- **Imports**: Auto-organized by Biome

### Architecture
- **Auth**: Better Auth at `/api/auth/[...all]`
- **APIs**: All through tRPC server, no Next.js API routes
- **Actions**: Use `actionClient` with Zod validation
- **Features**: Follow `/features/[name]/` pattern

### Execution Approach
1. Map scope - identify exact files to modify
2. Minimal changes - only what's directly required
3. Follow patterns - match existing conventions
4. No workarounds - fix root causes, never `as any`

## Template Status

This is a **template repository**. Check for `@ts-ignore.*Template build` comments:
- If present → Template mode, placeholder code exists
- If absent → Production mode, real data connected

### Customization Points
- `/apps/web/src/siteConfig.ts` - App name, logos, emails
- `/apps/web/src/lib/permissions.ts` - Roles
- `/apps/server/src/db/schema/` - Database schema
- `/packages/emails/` - Email templates

## Environment Variables

```bash
# apps/web/.env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_SERVER_URL=http://localhost:4000
RESEND_API_KEY=re_...

# apps/server/.env
DATABASE_URL=postgresql://...
CORS_ORIGIN=http://localhost:3001
```

## Documentation Index

### Core Docs
- [API.md](./docs/API.md) - tRPC procedures and endpoints
- [DATABASE.md](./docs/DATABASE.md) - Schema and queries
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

### Claude Docs (`/docs/claude/`)
| Category | Files |
|----------|-------|
| Development | commands.md, architecture.md, security-config.md |
| Best Practices | critical-thinking.md, debug.md, code-quality.md |
| Implementation | feature-patterns.md, data-fetching.md |
| Troubleshooting | common-mistakes.md, linting-errors.md, troubleshooting.md |
| Deployment | deployment.md |

## Key Patterns

### Feature Structure
```
/features/[name]/
  components/   → UI components
  actions/      → Server Actions
  queries/      → React Query hooks
  types/        → TypeScript types
```

### Server Actions
```typescript
"use server";
export const createAction = actionClient
  .inputSchema(zodSchema)
  .action(async ({ parsedInput }) => {
    // Always revalidatePath() after mutations
  });
```

### MainLayout Usage
```typescript
// ✅ In page.tsx with headers array
<MainLayout headers={[<PageHeader key="header" />]}>
  <Content />
</MainLayout>
// ❌ Never in layout.tsx
```

## Troubleshooting

### Bun Install Hangs
```bash
bun pm cache rm
rm -rf node_modules apps/*/node_modules packages/*/node_modules
bun install
```

### Memory Issues on Build
```bash
NODE_OPTIONS="--max-old-space-size=8192" bun build
```

## Testing

**Coverage**: Server 100% | Web ~98% statements, 100% lines/functions. See [TESTING-STRATEGY.md](./docs/TESTING-STRATEGY.md)

### TDD is Mandatory

All code changes follow **Test-Driven Development** (Red → Green → Refactor). See [AGENTS.md](./docs/AGENTS.md) for the full TDD protocol. Summary:
1. Write failing test first
2. Write minimum code to pass
3. Refactor while green
4. Run `bun test:coverage` — must stay above 80%

### Example CRUD Pattern

For new tRPC routers, copy these files as your starting point:
- **Router**: `apps/server/src/routers/example.ts` — full CRUD with Zod validation
- **Tests**: `apps/server/tests/unit/routers/example.test.ts` — schema + procedure tests

### When Adding a New CRUD Feature

Every new feature at `/features/[name]/` should include tests. Follow this checklist:

| What to Create | Where | What to Test |
|---------------|-------|-------------|
| **Zod schemas** | `tests/unit/features/[name]/types/` | Valid input, invalid input, edge cases |
| **Pure components** | `tests/unit/features/[name]/components/` | Rendering, props, user interaction |
| **Hooks** | `tests/unit/hooks/` | Return values, state changes, error handling |
| **Server actions** | `tests/unit/features/[name]/actions/` | Input validation, mock db calls, error paths |

### What NOT to Unit Test (Use E2E Instead)

- Form components with Radix UI Select (`*-form.tsx`)
- Table components with TanStack Table (`*table*.tsx`)
- Dialog/modal components (portal-based)
- Full page flows (auth, navigation, redirects)

### Test Patterns

**Schema test** (highest ROI, simplest):
```typescript
import { mySchema } from "@/features/[name]/types";
describe("mySchema", () => {
  it("validates correct input", () => {
    expect(mySchema.safeParse(validInput).success).toBe(true);
  });
  it("rejects empty name", () => {
    expect(mySchema.safeParse({ name: "" }).success).toBe(false);
  });
});
```

**Action test** (mock db, test logic):
```typescript
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }));
vi.mock("@/db", () => ({ db: mockDb }));

import { createItem } from "@/features/[name]/actions/create";
describe("createItem", () => {
  it("creates with valid input", async () => { /* ... */ });
  it("rejects unauthorized", async () => { /* ... */ });
});
```

**Component test** (render, interact, assert):
```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyComponent } from "@/features/[name]/components/my-component";

describe("MyComponent", () => {
  it("renders data", () => {
    render(<MyComponent data={testData} />);
    expect(screen.getByText("Expected")).toBeInTheDocument();
  });
});
```

### Test Utilities Available

| Utility | Import | Purpose |
|---------|--------|---------|
| `createTestUser()` | `@test-utils/component-factories` | Generate test user data |
| `createTestSession()` | `@test-utils/component-factories` | Generate auth sessions |
| `createTestClient()` | `@test-utils/component-factories` | Generate entity data |
| `mockDb` | `@test-utils/mock-db` | Mock Drizzle database |
| `createQueryWrapper()` | `@test-utils/query-test-utils` | React Query test wrapper |
| `createMockActionContext()` | `@test-utils/action-test-helpers` | Server action context |

### Coverage Rules

- **80% threshold** enforced in CI (statements, branches, functions, lines)
- New files in `src/` are automatically included in coverage
- Add exclusions to `vitest.config.ts` only for files better tested via E2E
- Run `bun test:coverage` locally before pushing

### E2E Bypass

`getUser.ts` checks for `E2E_TEST` cookie — when set to `"true"`, returns a mock admin session without hitting auth. Playwright tests set this cookie to bypass login.

## Important Notes

- Pre-commit hooks: Husky + lint-staged + commitlint
- CI/CD: GitHub Actions — quality, unit tests, E2E, build (all on every PR)
- Auth: Better Auth (not Supabase Auth)
- Dashboard: SidebarProvider in layout, use MainLayout for content
- Prefer editing existing files over creating new ones
