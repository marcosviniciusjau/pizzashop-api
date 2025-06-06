import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'
import { restaurants } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { env } from '@/env'
export const updateProfile = new Elysia().use(authentication).put(
  '/profile',
  // @ts-ignore
  async ({ getManagedRestaurantId, set, body }) => {
    const restaurantId = await getManagedRestaurantId()
    // @ts-ignore
    const { name, description } = body

    await db
      .update(restaurants)
      .set({
        name,
        description,
      })
      .where(eq(restaurants.id, restaurantId))

    set.status = 204
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
    }),
  },
)