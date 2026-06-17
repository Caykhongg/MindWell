import postgres from 'postgres';
const sql = postgres('postgres://postgres:postgres@localhost:5432/mindwell');
await sql `DROP SCHEMA IF EXISTS public CASCADE`;
await sql `CREATE SCHEMA public`;
await sql `DROP SCHEMA IF EXISTS drizzle CASCADE`;
console.log('All schemas dropped. Ready for fresh migrations.');
await sql.end();
//# sourceMappingURL=reset-db.js.map