# Database Rules — MindWell

## Stack
- **ORM:** Drizzle ORM
- **Driver:** postgres.js
- **Database:** PostgreSQL (SQLite for dev/legacy only)

## General Rules
- Never write raw SQL strings directly in business logic
- Always use Drizzle query builder
- All database calls must be inside try/catch blocks
- Use **transactions** for multi-step operations

## Connection Management
```ts
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

## Query Best Practices
```ts
// ✅ Select only needed fields
const user = await db.query.users.findFirst({
  where: eq(users.id, id),
  columns: { id: true, email: true, name: true }
});

// ❌ Avoid SELECT * — unless you need all fields

// ✅ Use pagination for lists
const users = await db.query.users.findMany({
  limit,
  offset: (page - 1) * limit,
  orderBy: desc(users.createdAt)
});
```

## Transactions
```ts
// ✅ Use transactions for atomic operations
await db.transaction(async (tx) => {
  await tx.insert(sessions).values(sessionData);
  await tx.update(counselors)
    .set({ nextAvailable: newSlots })
    .where(eq(counselors.id, counselorId));
});
```

## Migrations
```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit migrate

# Push schema (dev only)
npx drizzle-kit push
```

## Naming Conventions
- Tables: **snake_case** plural (`user_profiles`, `counseling_sessions`)
- Columns: **snake_case** (`created_at`, `counselor_id`)
- Indexes: `idx_[table]_[column]`
- Foreign keys: `fk_[table]_[referenced_table]`

## Security
- Never log query results containing sensitive data (passwords, tokens)
- Use parameterized queries — never string concatenation
- Encrypt PII columns at rest
