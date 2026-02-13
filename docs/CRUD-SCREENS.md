# Building CRUD Screens

> Complete guide for AI agents to implement Create, Read, Update, Delete screens following established patterns.

---

## Overview

This guide covers the full pattern for building CRUD screens in this codebase, including:
- Feature structure
- Component patterns
- Testing strategies
- Accessibility requirements
- Common pitfalls

---

## 1. Feature Structure

Every feature follows this structure:

```
/apps/web/src/features/[entity]/
├── actions/                    # Server Actions
│   ├── create[Entity].ts
│   ├── update[Entity].ts
│   ├── delete[Entity].ts
│   └── get[Entity].ts
├── components/                 # UI Components
│   ├── [entity]-details.tsx    # Read/Edit view
│   ├── [entity]-form.tsx       # Create/Edit form
│   ├── [entity]-table.tsx      # List view table
│   ├── [entity]-skeleton.tsx   # Loading skeleton
│   └── [entity]-content.tsx    # Content wrapper
├── hooks/                      # Custom hooks
│   └── use[Entity].ts
├── layout/                     # Page headers
│   ├── [entity]-header.tsx     # List page header
│   └── [entity]-detail-header.tsx
├── queries/                    # React Query hooks
│   └── use[Entity]Query.ts
└── types/                      # TypeScript types + Zod schemas
    └── index.ts
```

---

## 2. Component Patterns

### 2.1 Details Component (View/Edit Mode)

The details component handles both view and edit modes:

```typescript
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LabelValueItem } from "@/components/ui/label-value-item";

interface EntityDetailsProps {
  entity: Entity;
  isEditing?: boolean;
  onSave?: (data: Partial<Entity>) => Promise<void>;
}

export function EntityDetails({
  entity,
  isEditing = false,
  onSave
}: EntityDetailsProps) {
  const [formData, setFormData] = useState({
    name: entity.name ?? "",
    email: entity.email ?? "",
    // Always use ?? "" for optional fields to avoid uncontrolled input warnings
  });

  const handleSave = async () => {
    try {
      await onSave?.(formData);
      toast.success("Entity updated successfully");
    } catch (error) {
      toast.error("Failed to update entity");
    }
  };

  // Copy handler with proper null check
  const handleCopyId = () => {
    if (!entity.id) return; // Early return for null values
    navigator.clipboard.writeText(entity.id);
    toast.success("ID copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entity Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isEditing ? (
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        ) : (
          <LabelValueItem label="Name" value={entity.name} />
        )}
      </CardContent>
    </Card>
  );
}
```

### 2.2 Form Component

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEntitySchema, type CreateEntityInput } from "../types";

interface EntityFormProps {
  defaultValues?: Partial<CreateEntityInput>;
  onSubmit: (data: CreateEntityInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function EntityForm({ defaultValues, onSubmit, isSubmitting }: EntityFormProps) {
  const form = useForm<CreateEntityInput>({
    resolver: zodResolver(createEntitySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
```

### 2.3 Skeleton Component

```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EntitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
```

---

## 3. Accessibility Requirements (Critical for E2E Tests)

### 3.1 Always Add aria-labels to Icon-Only Buttons

```typescript
// BAD - E2E tests can't find this button reliably
<Button variant="ghost" onClick={onRemove}>
  <X className="size-4" />
</Button>

// GOOD - E2E tests can use getByRole("button", { name: "Remove filter" })
<Button
  variant="ghost"
  onClick={onRemove}
  aria-label="Remove filter"
>
  <X className="size-4" />
</Button>
```

### 3.2 Buttons with Hidden Text Need aria-label

```typescript
// BAD - Hidden text not accessible when icon-only on mobile
<Button onClick={onClear}>
  <FilterXIcon className="size-4 md:mr-1.5" />
  <span className="hidden md:inline">Clear</span>
</Button>

// GOOD - aria-label provides accessible name
<Button
  onClick={onClear}
  aria-label="Clear filters"
>
  <FilterXIcon className="size-4 md:mr-1.5" />
  <span className="hidden md:inline">Clear</span>
</Button>
```

### 3.3 E2E Test Selectors

```typescript
// Preferred: Use role + accessible name
await page.getByRole("button", { name: "Remove filter" }).click();
await page.getByRole("button", { name: /clear/i }).click();

// Acceptable: Use data-testid for complex scenarios
<div data-testid="entity-card">...</div>
await page.getByTestId("entity-card").click();

// Avoid: CSS selectors that break easily
// await page.locator(".btn-remove").click(); // fragile
```

---

## 4. Testing Patterns

### 4.1 Unit Test Structure

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EntityDetails } from "../entity-details";
import { createTestEntity } from "@test-utils/component-factories";

describe("EntityDetails", () => {
  const mockEntity = createTestEntity();

  describe("View Mode", () => {
    it("renders entity data correctly", () => {
      render(<EntityDetails entity={mockEntity} />);
      expect(screen.getByText(mockEntity.name)).toBeInTheDocument();
    });

    it("handles copy to clipboard", async () => {
      const user = userEvent.setup();
      const writeText = vi.fn();
      Object.assign(navigator, { clipboard: { writeText } });

      render(<EntityDetails entity={mockEntity} />);
      await user.click(screen.getByRole("button", { name: /copy/i }));

      expect(writeText).toHaveBeenCalledWith(mockEntity.id);
    });

    it("handles null values gracefully", () => {
      const entityWithNulls = createTestEntity({
        email: null,
        phone: null,
      });
      render(<EntityDetails entity={entityWithNulls} />);
      expect(screen.getByText("-")).toBeInTheDocument(); // fallback display
    });
  });

  describe("Edit Mode", () => {
    it("renders input fields", () => {
      render(<EntityDetails entity={mockEntity} isEditing />);
      expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    });

    it("initializes with entity values", () => {
      render(<EntityDetails entity={mockEntity} isEditing />);
      expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue(mockEntity.name);
    });

    it("handles null values with empty strings", () => {
      const entityWithNulls = createTestEntity({ email: null });
      render(<EntityDetails entity={entityWithNulls} isEditing />);
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");
    });
  });
});
```

### 4.2 What to Test

| Component Type | What to Test | Skip |
|---------------|--------------|------|
| **Details** | View mode rendering, edit mode inputs, null handling, clipboard copy | Complex form interactions |
| **Form** | Schema validation, error messages | Full submit flow (use E2E) |
| **Skeleton** | Structure renders | Animations |
| **Table** | Basic rendering | TanStack Table internals (use E2E) |

### 4.3 Coverage Branches to Hit

Always test these branches:

```typescript
// 1. Null coalescing in edit mode
const [formData, setFormData] = useState({
  name: entity.name ?? "",  // Test with null and with value
});

// 2. Early returns in handlers
const handleCopy = () => {
  if (!entity.id) return;  // Test with null id
  navigator.clipboard.writeText(entity.id);
};

// 3. Conditional rendering
{entity.email ? (
  <a href={`mailto:${entity.email}`}>{entity.email}</a>
) : (
  <span>-</span>
)}
```

---

## 5. Common Pitfalls & Fixes

### 5.1 TypeScript: Uncontrolled Input Warning

```typescript
// BAD - undefined causes uncontrolled input
const [name, setName] = useState(entity.name);

// GOOD - always use empty string fallback
const [name, setName] = useState(entity.name ?? "");
```

### 5.2 Case Sensitivity in Imports (CI Fails, Local Works)

```typescript
// BAD - macOS doesn't care, Linux CI fails
import { Icon } from "@/icons/CollapsibleIcon";  // file is collapsibleIcon.tsx

// GOOD - exact case match
import { Icon } from "@/icons/collapsibleIcon";
```

### 5.3 Toast Success After Async Operation

```typescript
// BAD - toast shows before operation completes
const handleCopy = () => {
  navigator.clipboard.writeText(entity.id);
  toast.success("Copied!");  // Race condition
};

// GOOD - await the async operation
const handleCopy = async () => {
  await navigator.clipboard.writeText(entity.id);
  toast.success("Copied!");
};
```

### 5.4 Missing Early Return for Null Values

```typescript
// BAD - crashes if entity.id is null
const handleCopy = () => {
  navigator.clipboard.writeText(entity.id);  // TypeError if null
};

// GOOD - guard clause
const handleCopy = () => {
  if (!entity.id) return;
  navigator.clipboard.writeText(entity.id);
};
```

---

## 6. E2E Test Patterns

### 6.1 Filter Tests

```typescript
import { test, expect } from "@playwright/test";

test.describe("Entity Filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/entities");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });
  });

  test("can add and remove a text filter", async ({ page }) => {
    // Open filter popover
    await page.getByRole("button", { name: /filter/i }).click();
    await expect(page.getByPlaceholder("Search...")).toBeVisible();

    // Select column
    await page.getByRole("option", { name: "Name" }).click();

    // Enter value
    await page.getByPlaceholder("Search...").fill("test");
    await page.waitForTimeout(600); // Debounce

    // Close and verify badge
    await page.keyboard.press("Escape");
    await expect(
      page.locator(".rounded-2xl").filter({ hasText: "Name" })
    ).toBeVisible();

    // Remove filter using aria-label
    await page.getByRole("button", { name: "Remove filter" }).click();
    await expect(
      page.locator(".rounded-2xl").filter({ hasText: "Name" })
    ).not.toBeVisible();
  });
});
```

### 6.2 CRUD Flow Test

```typescript
test.describe("Entity CRUD", () => {
  test("can create, view, edit, and delete entity", async ({ page }) => {
    // Create
    await page.goto("/dashboard/entities/new");
    await page.getByRole("textbox", { name: /name/i }).fill("Test Entity");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/entities\/[\w-]+/);

    // View
    await expect(page.getByText("Test Entity")).toBeVisible();

    // Edit
    await page.getByRole("button", { name: /edit/i }).click();
    await page.getByRole("textbox", { name: /name/i }).fill("Updated Entity");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page.getByText("Updated Entity")).toBeVisible();

    // Delete
    await page.getByRole("button", { name: /delete/i }).click();
    await page.getByRole("button", { name: /confirm/i }).click();
    await expect(page).toHaveURL("/dashboard/entities");
  });
});
```

---

## 7. CI/CD Considerations

### 7.1 Required Environment Variables

For E2E tests and builds, ensure these secrets are configured:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
BETTER_AUTH_SECRET

# Optional
NEXT_PUBLIC_APP_URL
BETTER_AUTH_DATABASE_URL
CODECOV_TOKEN
```

### 7.2 CI Caching Strategy

The CI workflow caches:
- **Bun dependencies** - `~/.bun/install/cache` + `node_modules`
- **Turborepo** - `.turbo` directory
- **Next.js** - `apps/web/.next/cache`
- **Playwright** - `~/.cache/ms-playwright`

### 7.3 Path-Based Filtering

CI only runs relevant jobs:

```yaml
# Only run web tests if web files changed
if: needs.changes.outputs.web == 'true'

# Only run E2E if web files changed
if: needs.changes.outputs.e2e == 'true'
```

---

## 8. Quick Checklist

Before submitting a CRUD feature PR:

- [ ] Feature follows `/features/[entity]/` structure
- [ ] All icon-only buttons have `aria-label`
- [ ] Null values handled with `?? ""`
- [ ] Details component tests view and edit modes
- [ ] Tests cover null value branches
- [ ] Import paths match exact file case
- [ ] E2E tests use role selectors with accessible names
- [ ] `bun test:coverage` passes 80% threshold
- [ ] `bun check-types` passes
- [ ] `bunx biome check --write <changed-files>` run

---

*Last Updated: 2026-02-06*
