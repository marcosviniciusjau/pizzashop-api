DO $$ BEGIN
 CREATE TYPE "categories" AS ENUM('pastries', 'beverages', 'savory snacks');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category" "categories" DEFAULT 'pastries' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_name_unique" UNIQUE("name");