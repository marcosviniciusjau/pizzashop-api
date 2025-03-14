import { users } from '@/db/schema'
import { db } from '@/db/connection'
import Elysia from 'elysia'
import { z } from 'zod'

const registerCustomerBodySchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

export const registerCustomer = new Elysia().post(
  '/customers',
  async ({ body, set }) => {
    const { name, phone, email } = registerCustomerBodySchema.parse(body)
    
    console.log("nao era pra registrar", name, email, phone)
    // @ts-ignore
    await db.insert(users).values({
      name,
      email,
      phone,
    })

    set.status = 201
  },
)
