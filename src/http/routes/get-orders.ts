import Elysia, { t } from 'elysia'
import { orders, users, orderItems, products } from '@/db/schema'
import { db } from '@/db/connection'
import { eq, and, ilike, desc, count, sql } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-typebox'
import { authentication } from '../authentication'

import { env } from '@/env'
export const getOrders = new Elysia().use(authentication).get(
  '/orders',
  // @ts-ignore
  async ({ query, getCurrentUser, set }) => {
    const { pageIndex, orderId, customerName, productName, status } = query
    const restaurantId = env.DEFAULT_RESTAURANT_ID

    if (!restaurantId) {
      set.status = 401

      throw new Error('User is not a restaurant manager.')
    }

    const baseQuery = db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
        status: orders.status,
        productName: products.name,
        customerName: users.name,
        total: orders.totalInCents,
      })
      .from(orders)
      // @ts-ignore
      .innerJoin(users, eq(users.id, orders.customerId))
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id)) // você precisa juntar orderItems
      .innerJoin(products, eq(products.id, orderItems.productId)) // depois juntar products via orderItems
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          orderId ? ilike(orders.id, `%${orderId}%`) : undefined,
          // @ts-ignore
          status ? eq(orders.status, status) : undefined,
          customerName ? ilike(users.name, `%${customerName}%`) : undefined,
          productName ? ilike(products.name, `%${products}%`) : undefined,
        ),
      )

    const [ordersCount] = await db
      .select({ count: count() })
      .from(baseQuery.as('baseQuery'))

    const allOrders = await baseQuery
      // @ts-ignore
      .offset(pageIndex * 10)
      .limit(10)
      .orderBy((fields) => {
        return [
          sql`CASE ${fields.status} 
            WHEN 'pending' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'delivering' THEN 3
            WHEN 'delivered' THEN 4
            WHEN 'canceled' THEN 99
          END`,
          desc(fields.createdAt),
        ]
      })

    const result = {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: ordersCount.count,
      },
    }

    return result
  },
  {
    query: t.Object({
      customerName: t.Optional(t.String()),
      productName: t.Optional(t.String()),
      orderId: t.Optional(t.String()),
      status: t.Optional(createSelectSchema(orders).properties.status),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  },
)
