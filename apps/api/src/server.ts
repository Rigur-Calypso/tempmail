import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { config } from './config'
import { logger } from './utils/logger'
import { prisma } from './db/prisma'
import { errorHandler } from './middleware/errorHandler'
import { generalLimiter } from './middleware/rateLimiter'
import { initSocket } from './socket/socket.gateway'
import { startCleanupJob } from './jobs/cleanup.job'
import { emitNewEmail } from './socket/socket.gateway'
import inboxRoutes from './routes/inbox.routes'
import webhookRoutes from './routes/webhook.routes'

const app = express()
const httpServer = createServer(app)

initSocket(httpServer)

app.set('trust proxy', 1)

app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use('/api', generalLimiter)

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: config.NODE_ENV,
    })
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
    })
  }
})

app.post('/api/admin/seed-domain', async (req, res) => {
  const { secret, domain } = req.body
  if (secret !== 'tempmail-seed-2026') {
    res.status(401).json({ error: 'unauthorized' })
    return
  }
  await prisma.domain.updateMany({
    where: {},
    data: { name: domain },
  })
  res.json({ ok: true, domain })
})

app.get('/api/admin/check-domain', async (_req, res) => {
  const domains = await prisma.domain.findMany()
  res.json(domains)
})

if (config.NODE_ENV === 'development') {
  app.post('/api/test/emit-email', (req, res) => {
    const { address, email } = req.body
    emitNewEmail(address, email)
    res.json({ ok: true })
  })
}

app.use(
  '/api/webhooks',
  express.urlencoded({ extended: true }),
  webhookRoutes
)

app.use('/api/inboxes', inboxRoutes)

app.use(errorHandler)

async function start() {
  try {
    await prisma.$connect()
    logger.info('Database connected')

    startCleanupJob()

    httpServer.listen(config.PORT, () => {
      logger.info(
        { port: config.PORT, env: config.NODE_ENV },
        'Server started'
      )
    })
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server')
    process.exit(1)
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

start()

export { httpServer }