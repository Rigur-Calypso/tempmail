import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z
    .string()
    .default('4000')
    .transform(Number),

  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required'),

  FRONTEND_URL: z
    .string()
    .default('http://localhost:3000'),

  MAILGUN_WEBHOOK_SIGNING_KEY: z
    .string()
    .default('placeholder-for-development'),

  DEFAULT_INBOX_EXPIRY_MINUTES: z
    .string()
    .default('10')
    .transform(Number),

  MAX_INBOXES_PER_IP_PER_HOUR: z
    .string()
    .default('5')
    .transform(Number),

  CLEANUP_INTERVAL_CRON: z
    .string()
    .default('*/5 * * * *'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const config = parsed.data