import Elysia from 'elysia'
import { authentication } from '../authentication'
import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { orderItems, orders, products } from '@/db/schema'
import { env } from '@/env'
export const getProducts = new Elysia()
  .use(authentication)
  // @ts-ignore
  .get('/get-products', async ({ getManagedRestaurantId }) => {
    //const restaurantId = env.DEFAULT_RESTAURANT_ID

    try {
      const product = await db
        .select({
          id: products.id,
          name: products.name,
          category: products.category,
          price: products.priceInCents,
        })
        .from(products)
        .groupBy(products.name, products.id)

      return product
    } catch (err) {
      console.log(err)
    }
  })
