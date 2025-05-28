import Elysia from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { orderItems, orders, products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { env } from '@/env'
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
        .from(products)
        .where(eq(products.restaurantId, restaurantId))
        .groupBy(products.name, products.id)

      return product
    } catch (err) {
      console.log(err)
    }
  })
