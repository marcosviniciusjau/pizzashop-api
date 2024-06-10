import Elysia, { Static, t } from 'elysia'
import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
import { env } from '@/env'
import { UnauthorizedError } from './routes/errors/unauthorized-error'
import { NotAManagerError } from './routes/errors/not-a-manager-error'

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const authentication = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayloadSchema,
    }),
  )
  .use(cookie())
  .derive(({ jwt, cookie, setCookie, removeCookie }) => {
    return {
      getCurrentUser: async () => {
        const payload = await jwt.verify(cookie.auth)

        return payload
      },
      signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
        setCookie('auth', await jwt.sign(payload), {
          httpOnly: true,
          maxAge: 7 * 86400,
          path: '/',
        })
      },
      signOut: () => {
        removeCookie('auth')
      },
    }
  })
  .derive(({ getCurrentUser }) => {
    return {
      getManagedRestaurantId: async () => {
        const { restaurantId } = await getCurrentUser()

        return restaurantId
      },
    }
  })
