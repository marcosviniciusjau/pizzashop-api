/* eslint-disable drizzle/enforce-delete-with-where */

import {
  authLinks,
  evaluations,
  orders,
  products,
  restaurants,
  users,
} from './schema'
import { faker } from '@faker-js/faker'
import { db } from './connection'
import chalk from 'chalk'
import { orderItems } from './schema/order-items'
import { createId } from '@paralleldrive/cuid2'

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

/**
 * Create customers
 */
const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
  ])
  .returning()

console.log(chalk.yellow('✔ Created customers'))

/**
 * Create restaurant manager
 */
const [manager] = await db
  .insert(users)
  .values({
    name: 'MV Araújo Websites',
    email: 'mvaraujowebsites@gmail.com',
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
    name: 'Pastel Pro',
    description: 'Os melhores sabores em um lugar só',
    managerId: manager.id,
  })
  .returning()

console.log(chalk.yellow('✔ Created restaurant'))

const availableProducts = await db
  .insert(products)
  .values([
    {
      name: 'Frango com Catupiry',
      category: 'pastries',
      priceInCents: 800,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com frango desfiado e catupiry',
    },
    {
      name: 'Queijo',
      category: 'pastries',
      priceInCents: 750,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com queijo mussarela',
    },
    {
      name: 'Calabresa',
      category: 'pastries',
      priceInCents: 850,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com calabresa e cebola',
    },
    {
      name: 'Carne',
      category: 'pastries',
      priceInCents: 900,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com carne moída temperada',
    },
    {
      name: 'Pizza',
      category: 'pastries',
      priceInCents: 950,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com queijo, presunto, tomate e orégano',
    },
    {
      name: 'Mexicano',
      category: 'pastries',
      priceInCents: 1000,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com carne moída, feijão, pimenta e cheddar',
    },
    {
      name: 'Brócolis com Ricota',
      category: 'pastries',
      priceInCents: 850,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com brócolis e ricota',
    },
    {
      name: 'Doce de Leite',
      category: 'pastries',
      priceInCents: 800,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com doce de leite',
    },
    {
      name: 'Romeu e Julieta',
      category: 'pastries',
      priceInCents: 850,
      restaurantId: restaurant.id,
      description: 'Pastel recheado com queijo e goiabada',
    },
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
    }
  ])
  .returning()

console.log(chalk.yellow('✔ Created products'))

/**
 * Create orders
 */
const ordersToInsert: (typeof orders.$inferInsert)[] = []
const orderItemsToPush: (typeof orderItems.$inferInsert)[] = []

for (let i = 0; i < 200; i++) {
  const orderId = createId()

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  })

  let totalInCents = 0

  orderProducts.forEach((orderProduct) => {
    const quantity = faker.number.int({
      min: 1,
      max: 3,
    })

    totalInCents += orderProduct.priceInCents * quantity

    orderItemsToPush.push({
      orderId,
      productId: orderProduct.id,
      priceInCents: orderProduct.priceInCents,
      quantity,
    })
  })

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
    restaurantId: restaurant.id,
    status: faker.helpers.arrayElement([
      'pending',
      'canceled',
      'processing',
      'delivering',
      'delivered',
    ]),
    totalInCents,
    createdAt: faker.date.recent({
      days: 40,
    }),
  })
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToPush)

console.log(chalk.yellow('✔ Created orders'))

console.log(chalk.greenBright('Database seeded successfully!'))

process.exit()
