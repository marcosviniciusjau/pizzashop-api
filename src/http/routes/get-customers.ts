import Elysia from 'elysia'
import { authentication } from '../authentication'
import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { orderItems, orders, users } from '@/db/schema'
import { env } from '@/env'
export const getCustomers = new Elysia()
  .use(authentication)
  // @ts-ignore
  .get('/get-customers', async ({ getManagedRestaurantId }) => {
    const restaurantId = env.DEFAULT_RESTAURANT_ID
    const role = 'customer'

    try {
      const customer = await db
        .select({
          id: users.id,
          name: users.name,
          phone: users.phone,
          email: users.email
        })
        .from(users)
        .where(and(eq(users.role, role)))

      return customer
    } catch (err) {
      console.log(err)
    }
  })
