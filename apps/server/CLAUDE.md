# Server App Guidelines

This is the Hono + tRPC server application.

## Quick Start

```bash
bun dev:server    # Start on port 4000
bun test          # Run unit tests
bun run compile   # Build standalone binary
```

## Structure

```
/src
├── db/
│   └── index.ts    → Drizzle client
├── lib/
│   ├── context.ts  → tRPC context
│   └── trpc.ts     → tRPC init
├── routers/
│   └── index.ts    → Main router
└── index.ts        → Hono entry point
```

## tRPC Procedures

### Public Procedure
```typescript
import { publicProcedure, router } from "../lib/trpc";
import { z } from "zod";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),

  getItem: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Access database via ctx.db
      return { id: input.id, name: "Example" };
    }),
});
```

### Protected Procedure
```typescript
import { TRPCError } from "@trpc/server";

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Usage
export const appRouter = router({
  getSecretData: protectedProcedure.query(async ({ ctx }) => {
    // ctx.user is typed and available
    return { userId: ctx.user.id };
  }),
});
```

### Mutations
```typescript
export const appRouter = router({
  createItem: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(items)
        .values({ name: input.name, description: input.description })
        .returning();
      return result[0];
    }),
});
```

## Database (Drizzle)

### Query
```typescript
import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";

// Select
const allItems = await db.select().from(items);

// Select with filter
const item = await db
  .select()
  .from(items)
  .where(eq(items.id, "123"))
  .limit(1);
```

### Insert
```typescript
const newItem = await db
  .insert(items)
  .values({
    id: crypto.randomUUID(),
    name: "New Item",
  })
  .returning();
```

### Update
```typescript
await db
  .update(items)
  .set({ name: "Updated Name" })
  .where(eq(items.id, "123"));
```

### Delete
```typescript
await db
  .delete(items)
  .where(eq(items.id, "123"));
```

### Transaction
```typescript
await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({ name: "John" }).returning();
  await tx.insert(items).values({ userId: user[0].id, name: "Item" });
});
```

## Schema Definition

```typescript
// /src/db/schema/items.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
```

## Database Commands

```bash
bun db:push      # Push schema changes
bun db:studio    # Open Drizzle Studio (port 4983)
bun db:migrate   # Run pending migrations
bun db:generate  # Generate migration files
```

## Testing

### Unit Test Pattern
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('appRouter', () => {
  it('healthCheck returns OK', async () => {
    const { appRouter } = await import('../src/routers/index');
    const result = appRouter.healthCheck.handler();
    expect(result).toBe('OK');
  });
});
```

### Mocking Database
```typescript
vi.mock('../src/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([{ id: '1', name: 'Test' }]),
  },
}));
```

## Error Handling

```typescript
import { TRPCError } from "@trpc/server";

// Throw typed errors
throw new TRPCError({
  code: "NOT_FOUND",
  message: "Item not found",
});

// Error codes:
// - UNAUTHORIZED (401)
// - FORBIDDEN (403)
// - NOT_FOUND (404)
// - BAD_REQUEST (400)
// - INTERNAL_SERVER_ERROR (500)
```

## Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ORIGIN=http://localhost:3001
```

## CORS Configuration

```typescript
// Already configured in index.ts
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);
```

## Rules

- Always use Zod for input validation
- Return proper tRPC errors, not generic ones
- Use transactions for multi-step operations
- Add indexes for frequently queried columns
- Export types from schema files
- Keep routers focused and modular
