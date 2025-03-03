import { relations } from 'drizzle-orm'
import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { restaurants, users } from '.'
import { nanoid } from 'nanoid'

export const evaluations = pgTable('evaluations', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  customerName: text('customer_id').references(() => users.name),
  restaurantId: text('restaurant_id').references(() => users.name),
  rate: integer('rate').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  customer: one(users, {
    fields: [evaluations.customerName],
    references: [users.name],
  }),
  restaurant: one(restaurants, {
    fields: [evaluations.restaurantId],
    references: [restaurants.id],
  }),
}))
