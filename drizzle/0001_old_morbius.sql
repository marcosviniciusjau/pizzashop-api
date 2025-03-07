CREATE TYPE "public"."sizes" AS ENUM('small', 'medium', 'big');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "size" "sizes";