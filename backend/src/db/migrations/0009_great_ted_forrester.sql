ALTER TABLE "mental_tests" DROP CONSTRAINT "mental_tests_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "mental_tests" ALTER COLUMN "user_id" DROP NOT NULL;