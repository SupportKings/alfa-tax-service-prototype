# Database Documentation

This document describes the database schema, relationships, and migration patterns.

## Overview

- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit

## Connection

```typescript
// /apps/server/src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL || "");
```

## Environment Variables

```bash
# Primary database connection
DATABASE_URL=postgresql://user:password@host:5432/database

# Better Auth database (can be same as DATABASE_URL)
BETTER_AUTH_DATABASE_URL=postgresql://user:password@host:5432/database
```

## Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ sessions : has
    users ||--o{ accounts : has
    users ||--o{ verifications : has

    users {
        text id PK
        text name
        text email UK
        boolean emailVerified
        text image
        timestamp createdAt
        timestamp updatedAt
    }

    sessions {
        text id PK
        text userId FK
        text token UK
        timestamp expiresAt
        text ipAddress
        text userAgent
        timestamp createdAt
        timestamp updatedAt
    }

    accounts {
        text id PK
        text userId FK
        text accountId
        text providerId
        text accessToken
        text refreshToken
        timestamp accessTokenExpiresAt
        timestamp refreshTokenExpiresAt
        text scope
        text idToken
        text password
        timestamp createdAt
        timestamp updatedAt
    }

    verifications {
        text id PK
        text identifier
        text value
        timestamp expiresAt
        timestamp createdAt
        timestamp updatedAt
    }
```

### Tables

#### Users

Core user table managed by Better Auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PK | Unique identifier |
| name | TEXT | | User's display name |
| email | TEXT | UNIQUE | User's email address |
| emailVerified | BOOLEAN | | Email verification status |
| image | TEXT | | Profile image URL |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

#### Sessions

User session management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PK | Session identifier |
| userId | TEXT | FK → users.id | User reference |
| token | TEXT | UNIQUE | Session token |
| expiresAt | TIMESTAMP | NOT NULL | Expiration time |
| ipAddress | TEXT | | Client IP |
| userAgent | TEXT | | Client user agent |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

#### Accounts

OAuth and credential accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PK | Account identifier |
| userId | TEXT | FK → users.id | User reference |
| accountId | TEXT | NOT NULL | Provider account ID |
| providerId | TEXT | NOT NULL | Auth provider ID |
| accessToken | TEXT | | OAuth access token |
| refreshToken | TEXT | | OAuth refresh token |
| accessTokenExpiresAt | TIMESTAMP | | Token expiration |
| refreshTokenExpiresAt | TIMESTAMP | | Refresh token expiration |
| scope | TEXT | | OAuth scopes |
| idToken | TEXT | | OAuth ID token |
| password | TEXT | | Hashed password |
| createdAt | TIMESTAMP | NOT NULL | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update timestamp |

#### Verifications

OTP and email verification tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PK | Verification identifier |
| identifier | TEXT | NOT NULL | Email or phone |
| value | TEXT | NOT NULL | Verification code/token |
| expiresAt | TIMESTAMP | NOT NULL | Expiration time |
| createdAt | TIMESTAMP | | Creation timestamp |
| updatedAt | TIMESTAMP | | Last update timestamp |

## Adding New Tables

### 1. Define Schema

Create schema file in `/apps/server/src/db/schema/`:

```typescript
// /apps/server/src/db/schema/posts.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  published: boolean("published").default(false),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

### 2. Export Schema

```typescript
// /apps/server/src/db/schema/index.ts
export * from "./users";
export * from "./posts";
```

### 3. Generate Migration

```bash
bun db:generate
```

### 4. Apply Migration

```bash
bun db:migrate
```

## Queries

### Basic Queries

```typescript
import { db } from "@/db";
import { users, posts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// Select all
const allUsers = await db.select().from(users);

// Select with filter
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, "user@example.com"))
  .limit(1);

// Insert
const newUser = await db
  .insert(users)
  .values({
    id: crypto.randomUUID(),
    email: "new@example.com",
    name: "New User",
  })
  .returning();

// Update
await db
  .update(users)
  .set({ name: "Updated Name" })
  .where(eq(users.id, userId));

// Delete
await db.delete(users).where(eq(users.id, userId));
```

### Joins

```typescript
// Inner join
const postsWithAuthors = await db
  .select({
    post: posts,
    author: users,
  })
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id));

// Left join
const usersWithPosts = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId));
```

### Transactions

```typescript
await db.transaction(async (tx) => {
  const user = await tx
    .insert(users)
    .values({ id: "1", email: "user@example.com" })
    .returning();

  await tx.insert(posts).values({
    id: "1",
    title: "First Post",
    authorId: user[0].id,
  });
});
```

## Migrations

### Commands

```bash
# Generate migration from schema changes
bun db:generate

# Apply pending migrations
bun db:migrate

# Push schema directly (development only)
bun db:push

# Open Drizzle Studio
bun db:studio
```

### Migration Files

Migrations are stored in `/apps/server/drizzle/`:

```
/drizzle
├── 0000_initial.sql
├── 0001_add_posts.sql
└── meta/
    └── _journal.json
```

## Indexes

Add indexes for frequently queried columns:

```typescript
import { pgTable, text, index } from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id").notNull(),
    // ... other columns
  },
  (table) => ({
    authorIdIdx: index("posts_author_id_idx").on(table.authorId),
  })
);
```

## Type Generation

Generate TypeScript types from Supabase:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/web/src/utils/supabase/database.types.ts
```

Use generated types:

```typescript
import type { Tables, TablesInsert, TablesUpdate } from "@/utils/supabase/database.types";

type User = Tables<"users">;
type NewUser = TablesInsert<"users">;
type UpdateUser = TablesUpdate<"users">;
```

## Best Practices

1. **Always use transactions** for multiple related operations
2. **Add indexes** on foreign keys and frequently filtered columns
3. **Use soft deletes** for important data (add `deletedAt` column)
4. **Validate data** with Zod before database operations
5. **Use connection pooling** in production (configure in DATABASE_URL)
