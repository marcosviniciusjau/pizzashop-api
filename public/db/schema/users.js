import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { nanoid } from 'nanoid';
export const userRoleEnum = pgEnum('user_role', ['manager', 'customer']);
export const users = pgTable('users', {
    id: text('id')
        .$defaultFn(() => nanoid())
        .primaryKey(),
    name: text('name').notNull().unique(),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    role: userRoleEnum('role').default('customer').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
}));
