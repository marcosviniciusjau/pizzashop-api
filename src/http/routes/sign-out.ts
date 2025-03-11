import Elysia from 'elysia'
import { authentication } from '../authentication'

export const signOut = new Elysia()
  .use(authentication)
  // @ts-ignore
  .post('/sign-out', async ({ signOut }) => {
    signOut()
  })
