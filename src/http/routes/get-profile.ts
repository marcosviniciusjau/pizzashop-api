import Elysia from 'elysia'
import { authentication } from '../authentication'
import { db } from '@/db/connection'

export const getProfile = new Elysia()
  .use(authentication)
  // @ts-ignore
  .get('/me', async ({ getCurrentUser }) => {
    const { sub: userId } = await getCurrentUser()
    console.log("pq vc implicoou?", userId)

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      throw new Error('User not found.')
    }

    return user
  })
