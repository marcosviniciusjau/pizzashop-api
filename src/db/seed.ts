/* eslint-disable drizzle/enforce-delete-with-where */

import {
  authLinks,
  evaluations,
  orders,
  products,
  restaurants,
  users,
} from './schema'
import { db } from './connection'
import chalk from 'chalk'
import { orderItems } from './schema/order-items'
import { env } from '@/env'

/**
 * Reset database
 */
await db.delete(orderItems)
await db.delete(orders)
await db.delete(evaluations)
await db.delete(products)
await db.delete(restaurants)
await db.delete(authLinks)
await db.delete(users)

console.log(chalk.yellow('✔ Database reset'))
try {
  /**
   * Create restaurant manager
   */
  const [manager] = await db
    .insert(users)
    .values({
      name: 'Pizza Shop',
      email: env.RESTAURANT_EMAIL,
      role: 'manager',
    })
    .returning()

  console.log(chalk.yellow('✔ Created manager'))

  /**
   * Create restaurant
   */
  const [restaurant] = await db
    .insert(restaurants)
    .values({
      name: 'Pizza Pro',
      description: 'Os melhores sabores em um lugar só',
      managerId: manager.id,
    })
    .returning()

  console.log(chalk.yellow('✔ Created restaurant'))

  await db
    .insert(products)
    .values([
      {
        name: 'Coca-cola',
        category: 'beverages',
        priceInCents: 1000,
        restaurantId: restaurant.id,
        description: 'Coca-cola em lata',
      },
      {
        name: 'Fanta',
        category: 'beverages',
        priceInCents: 1000,
        restaurantId: restaurant.id,
        description: 'Fanta lata',
      },
    ])
    .returning()

  console.log(chalk.yellow('✔ Created products'))

  console.log(chalk.greenBright('Database seeded successfully!'))

  process.exit()

}
catch (error) {
  console.error(error)
}