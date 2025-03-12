import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { restaurants, users } from '.';
import { orderItems } from './order-items';
import { nanoid } from 'nanoid';
export const orderStatusEnum = pgEnum('order_status', [
    'pending',
    'canceled',
    'processing',
    'delivering',
    'delivered',
]);
export const orders = pgTable('orders', {
    id: text('id')
        .$defaultFn(() => nanoid())
        .primaryKey(),
    customerEmail: text('customer_email')
        .references(() => users.email, {
        onDelete: 'set null',
    })
        .notNull(),
    restaurantId: text('restaurant_id')
        .references(() => restaurants.id, {
        onDelete: 'set null',
    })
        .notNull(),
    status: orderStatusEnum('status').default('pending').notNull(),
    totalInCents: integer('total_in_cents').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
export const ordersRelations = relations(orders, ({ one, many }) => ({
    customer: one(users, {
        fields: [orders.customerEmail],
        references: [users.email],
    }),
    restaurant: one(restaurants, {
        fields: [orders.restaurantId],
        references: [restaurants.id],
    }),
    orderItems: many(orderItems),
}));
