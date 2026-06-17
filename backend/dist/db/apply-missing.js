import postgres from 'postgres';
import { config } from '../config/index.js';
const sql = postgres(config.database.url);
const statements = [
    // 0006 - counselor availability tables
    `CREATE TABLE IF NOT EXISTS "counselor_availability" (
    "id" serial PRIMARY KEY NOT NULL,
    "counselor_id" integer NOT NULL,
    "day_of_week" varchar(10) NOT NULL,
    "start_time" time NOT NULL,
    "end_time" time NOT NULL,
    "is_available" boolean NOT NULL
  )`,
    `CREATE TABLE IF NOT EXISTS "counselor_time_off" (
    "id" serial PRIMARY KEY NOT NULL,
    "counselor_id" integer NOT NULL,
    "date" varchar(20) NOT NULL,
    "reason" varchar(255)
  )`,
    // Add guest columns to comments if missing
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='guest_name') THEN
      ALTER TABLE "comments" ADD COLUMN "guest_name" varchar(100);
    END IF;
  END $$`,
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='guest_email') THEN
      ALTER TABLE "comments" ADD COLUMN "guest_email" varchar(255);
    END IF;
  END $$`,
    // Add guest columns to posts if missing
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='guest_name') THEN
      ALTER TABLE "posts" ADD COLUMN "guest_name" varchar(100);
    END IF;
  END $$`,
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='guest_email') THEN
      ALTER TABLE "posts" ADD COLUMN "guest_email" varchar(255);
    END IF;
  END $$`,
    // FKs for counselor_availability
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='counselor_availability_counselor_id_users_id_fk') THEN
      ALTER TABLE "counselor_availability" ADD CONSTRAINT "counselor_availability_counselor_id_users_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users"("id") ON DELETE cascade;
    END IF;
  END $$`,
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='counselor_time_off_counselor_id_users_id_fk') THEN
      ALTER TABLE "counselor_time_off" ADD CONSTRAINT "counselor_time_off_counselor_id_users_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users"("id") ON DELETE cascade;
    END IF;
  END $$`,
    // 0007 - is_anonymous column
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='is_anonymous') THEN
      ALTER TABLE "comments" ADD COLUMN "is_anonymous" integer NOT NULL DEFAULT 0;
    END IF;
  END $$`,
    // 0008 - reports table
    `CREATE TABLE IF NOT EXISTS "reports" (
    "id" serial PRIMARY KEY NOT NULL,
    "post_id" integer NOT NULL,
    "reporter_id" integer NOT NULL,
    "reason" varchar(500) NOT NULL,
    "is_resolved" boolean NOT NULL DEFAULT false,
    "created_at" timestamp NOT NULL DEFAULT now()
  )`,
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='reports_post_id_posts_id_fk') THEN
      ALTER TABLE "reports" ADD CONSTRAINT "reports_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade;
    END IF;
  END $$`,
    `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='reports_reporter_id_users_id_fk') THEN
      ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade;
    END IF;
  END $$`,
];
for (const stmt of statements) {
    try {
        await sql.unsafe(stmt);
        console.log('OK');
    }
    catch (e) {
        console.log('SKIP:', e.message?.slice(0, 120));
    }
}
console.log('Done!');
await sql.end();
//# sourceMappingURL=apply-missing.js.map