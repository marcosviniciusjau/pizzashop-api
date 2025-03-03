CREATE TYPE "public"."user_role" AS ENUM('manager', 'customer');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'canceled', 'processing', 'delivering', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."categories" AS ENUM('pizzas', 'beverages', 'savory snacks');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"manager_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text,
	"restaurant_id" text,
	"rate" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_email" text NOT NULL,
	"restaurant_id" text NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"total_in_cents" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "auth_links" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "auth_links_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "categories" DEFAULT 'pizzas' NOT NULL,
	"price_in_cents" integer NOT NULL,
	"restaurant_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text,
	"quantity" integer DEFAULT 1,
	"price_in_cents" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_customer_id_users_name_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_restaurant_id_users_name_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."users"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_email_users_email_fk" FOREIGN KEY ("customer_email") REFERENCES "public"."users"("email") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_links" ADD CONSTRAINT "auth_links_user_id_users_name_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;