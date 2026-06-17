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
CREATE TABLE "library_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(100) DEFAULT 'general' NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"tags" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"related_id" integer,
	"is_read" boolean NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "guest_name" varchar(100);--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "guest_email" varchar(255);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "guest_name" varchar(100);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "guest_email" varchar(255);--> statement-breakpoint
ALTER TABLE "counselor_availability" ADD CONSTRAINT "counselor_availability_counselor_id_users_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_time_off" ADD CONSTRAINT "counselor_time_off_counselor_id_users_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_articles" ADD CONSTRAINT "library_articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;