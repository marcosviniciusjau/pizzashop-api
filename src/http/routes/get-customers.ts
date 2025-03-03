import Elysia from 'elysia'
import { authentication } from '../authentication'
import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { orderItems, orders, users } from '@/db/schema'

export const getCustomers = new Elysia()
  .use(authentication)
  .get('/get-customers', async ({ getManagedRestaurantId }) => {
    const restaurantId = await getManagedRestaurantId()
    const role = 'customer'

    try {
      const customer = await db
        .select({
          id: users.name,
          name: users.name,
          phone: users.phone
        })
        .from(users)
        .where(and(eq(users.role, role)))

      return customer
    } catch (err) {
      console.log(err)
    }
  })
