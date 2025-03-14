import Elysia from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { env } from '@/env'
export const getManagedRestaurant = new Elysia()
  .use(authentication)
  // @ts-ignore
  .get('/managed-restaurant', async ({ getManagedRestaurantId }) => {
    const restaurantId = env.DEFAULT_RESTAURANT_ID

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    if (!restaurant) {
      throw new Error('Restaurant not found.')
    }

    return restaurant
  })
