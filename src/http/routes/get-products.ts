import Elysia from 'elysia'
import { authentication } from '../authentication'
import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { orderItems, orders, products } from '@/db/schema'

export const getProducts = new Elysia()
  .use(authentication)
  .get('/get-products', async ({ getManagedRestaurantId }) => {
    const restaurantId = await getManagedRestaurantId()

    try {
      const product = await db
        .select({
          id: products.id,
          name: products.name,
          category: products.category,
          price: products.priceInCents,
        })
        .from(orderItems)
        .leftJoin(orders, eq(orders.id, orderItems.orderId))
        .leftJoin(products, eq(products.id, orderItems.productId))
        .where(and(eq(orders.restaurantId, restaurantId)))
        .groupBy(products.name, products.id)

      return product
    } catch (err) {
      console.log(err)
    }
  })
