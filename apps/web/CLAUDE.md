# Web App Guidelines

This is the Next.js 15 web application with App Router.

## Quick Start

```bash
bun dev:web    # Start on port 3001
bun test       # Run unit tests
bun test:e2e   # Run E2E tests
```

## Structure

```
/src
├── app/           → App Router pages
├── components/
│   └── ui/        → shadcn/ui components
├── features/      → Feature modules
├── lib/           → Utilities, auth client
└── middleware.ts  → Route protection
```

## Key Files

| File | Purpose |
|------|---------|
| `siteConfig.ts` | App name, logos, email config |
| `middleware.ts` | Auth redirects |
| `lib/auth-client.ts` | Better Auth client |
| `lib/utils.ts` | `cn()` helper |

## Component Patterns

### Server Components (Default)
```typescript
// No directive needed - server by default
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Client Components
```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### MainLayout Usage
```typescript
// In page.tsx, not layout.tsx
<MainLayout headers={[<PageHeader key="header" />]}>
  <Content />
</MainLayout>
```

## Server Actions

```typescript
"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const createItem = actionClient
  .inputSchema(z.object({
    name: z.string().min(1),
  }))
  .action(async ({ parsedInput }) => {
    // Implementation
    revalidatePath("/items");
    return { success: true };
  });
```

## Feature Structure

```
/features/[name]/
├── actions/      → Server Actions
├── components/   → Feature UI
├── hooks/        → React hooks
├── layout/       → Page headers
├── queries/      → React Query hooks
└── types/        → TypeScript types
```

## Data Fetching

### React Query + tRPC
```typescript
import { trpc } from "@/lib/trpc";

// In client component
const { data, isLoading } = trpc.items.list.useQuery();

// Mutation
const mutation = trpc.items.create.useMutation({
  onSuccess: () => {
    // Handle success
  },
});
```

### Server Components
```typescript
// Direct fetch in server component
export default async function ItemsPage() {
  const items = await fetch('/api/items').then(r => r.json());
  return <ItemList items={items} />;
}
```

## Styling

- TailwindCSS v4 with `@tailwindcss/postcss`
- Use `cn()` for conditional classes
- shadcn/ui components in `/components/ui/`
- Custom classes via `cva()` or `tv()`

## Testing

**Coverage**: ~98% statements, 100% functions/lines. 80% threshold enforced in CI.

### Adding Tests for a New Feature

When you create a new feature at `src/features/[name]/`, add tests in `tests/unit/features/[name]/`:

```
tests/unit/features/[name]/
├── types/[name]-schema.test.ts    → Zod schema validation
├── components/[name]-card.test.tsx → Pure component tests
└── actions/create-[name].test.ts  → Server action tests
```

**1. Schema tests** (always do these first — highest ROI):
```typescript
import { createItemSchema } from "@/features/[name]/types";
describe("createItemSchema", () => {
  it("validates correct input", () => {
    expect(createItemSchema.safeParse({ name: "Test" }).success).toBe(true);
  });
  it("rejects empty name", () => {
    expect(createItemSchema.safeParse({ name: "" }).success).toBe(false);
  });
});
```

**2. Component tests** (for pure/presentational components):
```typescript
import { render, screen } from "@testing-library/react";
import { ItemCard } from "@/features/[name]/components/item-card";
describe("ItemCard", () => {
  it("renders item name", () => {
    render(<ItemCard item={{ id: "1", name: "Test" }} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

**3. Action tests** (mock db and auth):
```typescript
vi.mock("@/db", () => ({ db: mockDb }));
import { createItem } from "@/features/[name]/actions/create";
describe("createItem", () => {
  it("inserts into database", async () => { /* ... */ });
});
```

### Skip Unit Tests For (Use E2E)

- `*-form.tsx` — Radix UI Select breaks in jsdom
- `*table*.tsx` — TanStack Table internals
- `*dialog*.tsx` — Portal-based components
- `*-form.tsx` — Complex form components

### Test Utilities

```typescript
import { createTestUser, createTestClient } from "@test-utils/component-factories";
import { mockDb } from "@test-utils/mock-db";
import { createQueryWrapper } from "@test-utils/query-test-utils";
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/App/);
});
```

Playwright auto-starts dev server. E2E bypass: set `E2E_TEST=true` cookie to skip auth.

## Common Patterns

### Form with React Hook Form
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export function EmailForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
```

### Loading States
```typescript
import { Skeleton } from '@/components/ui/skeleton';

export function ItemSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
```

## Rules

- Use Server Components by default
- Add `'use client'` only when needed
- Never nest `<ul>` in `<p>`
- Add `type="button"` to non-submit buttons
- Use shadcn/ui components, don't recreate
- Use `actionClient` for server actions
- Always revalidate after mutations
