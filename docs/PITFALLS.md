# Common Pitfalls & Solutions

This document captures common issues encountered when building features with this template, particularly around CRUD operations and TypeScript.

## TypeScript Errors

### 1. TanStack Table ColumnDef Type Errors

**Problem**: When defining table columns, TypeScript complains about column type mismatches:
```
Type '((ColumnDefBase<RowType, unknown> & StringHeaderIdentifier) | ...)[]'
is not assignable to type 'ColumnDef<RowType>[]'
```

**Solution**: Add explicit type assertion when passing columns:
```typescript
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<MyRowType>();
const columns = [/* ... */];

// When passing to hooks or components:
<DataTable columns={columns as ColumnDef<MyRowType>[]} />
```

### 2. Recharts Type Incompatibilities

**Problem**: Recharts props like `activeDot`, `dot`, `onClick` have complex type signatures that TypeScript struggles with.

**Solution**: Use type assertions with `as unknown as`:
```typescript
// For activeDot/dot callbacks
activeDot={((props: unknown) => {
  const typedProps = props as DotProps;
  // ... use typedProps
}) as unknown as boolean}

// For onClick handlers
onClick={(props: unknown, event: React.MouseEvent) => {
  const { name } = props as LineClickProps;
  // ... use name
}}
```

### 3. Filter Value Type Mismatches

**Problem**: Supabase filter values expect `string` but filter state contains `string | number | Date`.

**Solution**: Always cast filter values:
```typescript
// For single values
query = query.eq(columnId, String(values[0]));

// For array values (in/not in)
query = query.in(columnId, values.map((v) => String(v)));

// For date comparisons
if (operator === "is after") {
  query = query.gt(columnId, String(values[0]));
}
```

### 4. Generic Type Constraints in Hooks

**Problem**: Generic types don't satisfy constraints in complex filter/table hooks.

**Solution**: Simplify generic constraints or use type assertions:
```typescript
// Instead of complex conditional types:
options?: TColumns extends ... ? ... : never

// Use simpler Record types:
options?: Record<string, Map<string, number>>
```

### 5. Supabase Faceted Data Type Errors

**Problem**: Supabase returns `GenericStringError[]` for faceted queries, not the expected type.

**Solution**: Cast through `unknown`:
```typescript
for (const item of (facetData as unknown as Record<string, unknown>[])) {
  const value = item[columnId];
  // ...
}
```

## Sidebar Navigation

### Adding New Routes

**Problem**: Adding new routes to sidebar without proper types causes TSC errors.

**Solution**: Follow the exact pattern in `sidebarConfig.ts`:
```typescript
// Always include all required properties
{
  title: "Feature Name",
  url: "/dashboard/feature",
  icon: FeatureIcon,
}

// For nested items:
{
  title: "Group",
  icon: GroupIcon,
  items: [
    { title: "Sub-item", url: "/dashboard/group/sub-item" },
  ],
}
```

### Icon Import Errors

**Problem**: Importing icons that don't exist or have wrong names.

**Solution**: Use consistent icon library (remix-react-icons):
```typescript
import { RiUserLine, RiSettingsLine } from "@remixicon/react";
```

## Server Actions

### 1. Return Type Validation Errors

**Problem**: `returnValidationErrors` requires specific schema types.

**Solution**: Use `throw new Error()` for simple error handling, or ensure schema matches:
```typescript
// Simple approach - throw errors
if (!user) {
  throw new Error("User not found");
}

// Or use proper validation errors with matching schema
return returnValidationErrors(schema, {
  _errors: ["Error message"],
});
```

### 2. Definite Assignment for Variables

**Problem**: Variables assigned in conditional blocks may be "used before assigned".

**Solution**: Use definite assignment assertion:
```typescript
let userId!: string; // Note the !

if (condition) {
  userId = "value1";
} else {
  userId = "value2";
}
// Now TypeScript knows userId is definitely assigned
```

## E2E Testing

### Auth Bypass Pattern

**Problem**: E2E tests fail because they can't authenticate.

**Solution**: Use E2E_TEST cookie bypass:

1. **Middleware** (`src/middleware.ts`):
```typescript
export async function middleware(request: NextRequest) {
  // E2E test bypass
  const e2eCookie = request.cookies.get("E2E_TEST");
  if (e2eCookie) {
    return NextResponse.next();
  }
  // ... rest of auth logic
}
```

2. **Auth Fixture** (`e2e/fixtures/auth.fixture.ts`):
```typescript
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, context }, use) => {
    await context.addCookies([
      { name: "E2E_TEST", value: "true", domain: "localhost", path: "/" },
    ]);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await use(page);
    await context.clearCookies();
  },
});
```

3. **Usage**:
```typescript
import { test, expect } from "./fixtures/auth.fixture";

test("dashboard loads", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/dashboard");
  // No auth redirect!
});
```

## Unit Testing

### jest-dom Matchers

**Problem**: `document is not defined` or matchers not working.

**Solution**: Proper setup in `tests/setup.tsx`:
```typescript
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

And in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["@testing-library/jest-dom"]
  }
}
```

## Database Schema

### Missing Tables

**Problem**: Code references tables that don't exist in `database.types.ts`.

**Solution**:
1. Check actual schema: `bun db:studio`
2. Regenerate types: `bun db:generate`
3. Use correct table names from the generated types

### Soft Delete Pattern

**Problem**: Forgetting to filter soft-deleted records.

**Solution**: Always add `.eq("is_deleted", false)` to queries:
```typescript
const { data } = await supabase
  .from("table")
  .select("*")
  .eq("is_deleted", false);
```

## Build & CI

### Lockfile Frozen Errors

**Problem**: CI fails with "lockfile had changes, but lockfile is frozen".

**Solution**: Update and commit lockfile locally:
```bash
bun install
git add bun.lock
git commit -m "chore: update bun lockfile"
git push
```

### Memory Issues on Build

**Problem**: Build runs out of memory.

**Solution**: Increase Node memory:
```bash
NODE_OPTIONS="--max-old-space-size=8192" bun build
```

## React/Next.js

### MainLayout Usage

**Problem**: Using MainLayout in wrong location causes hydration errors.

**Solution**: Only use in `page.tsx`, never in `layout.tsx`:
```typescript
// page.tsx - CORRECT
export default function FeaturePage() {
  return (
    <MainLayout headers={[<PageHeader key="header" />]}>
      <Content />
    </MainLayout>
  );
}
```

### Client vs Server Components

**Problem**: Using hooks in server components.

**Solution**: Add `'use client'` directive for components using:
- `useState`, `useEffect`, or other hooks
- Event handlers (`onClick`, etc.)
- Browser APIs
