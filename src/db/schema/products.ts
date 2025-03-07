import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { restaurants } from '.'
import { orderItems } from './order-items'
import { nanoid } from 'nanoid'
export const categoriesEnum = pgEnum('categories', [
  'pizzas',
  'beverages',
  'savory snacks',
])
export const sizesEnum = pgEnum('sizes', [
  'small',
  'medium',
  'big',
])

export const products = pgTable('products', {
  id: text('id')
    .$defaultFn(() => nanoid())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  size: sizesEnum('size'),
  category: categoriesEnum('category').default('pizzas').notNull(),
  priceInCents: integer('price_in_cents').notNull(),
  restaurantId: text('restaurant_id')
    .references(() => restaurants.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const productsRelations = relations(products, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [products.restaurantId],
    references: [restaurants.id],
    relationName: 'productRestaurant',
  }),
  orderItems: many(orderItems),
}))
