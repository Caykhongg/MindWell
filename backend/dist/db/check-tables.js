import postgres from 'postgres';
import { config } from '../config/index.js';
const sql = postgres(config.database.url);
// Set search path to drizzle schema
await sql `SET search_path TO 'drizzle'`;
const hashes = await sql `SELECT id, hash FROM "__drizzle_migrations" ORDER BY id`;
console.log('Applied migrations:');
for (const h of hashes) {
    console.log(`  #${h.id}: ${h.hash}`);
}
await sql.end();
//# sourceMappingURL=check-tables.js.map