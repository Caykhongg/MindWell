CREATE TABLE "counselor_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"counselor_id" integer NOT NULL,
	"day_of_week" varchar(10) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"is_available" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counselor_time_off" (
	"id" serial PRIMARY KEY NOT NULL,
	"counselor_id" integer NOT NULL,
	"date" varchar(20) NOT NULL,
	"reason" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "counselor_availability" ADD CONSTRAINT "counselor_availability_counselor_id_users_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_time_off" ADD CONSTRAINT "counselor_time_off_counselor_id_users_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;