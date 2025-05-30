import { z } from 'zod'

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  DB_URL: z.string().url().min(1),
  EMAIL: z.string(),
  RESTAURANT_EMAIL: z.string().email(),
  JWT_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  DEFAULT_RESTAURANT_ID: z.string().min(1),
})

export const env = envSchema.parse(process.env)
