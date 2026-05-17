import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { config } from './config'
import { logger } from './utils/logger'
import { prisma } from './db/prisma'
import { errorHandler } from './middleware/errorHandler'
import { generalLimiter } from './middleware/rateLimiter'
import inboxRoutes from './routes/inbox.routes'

const app = express()
const httpServer = createServer(app)

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

app.use('/api/inboxes', inboxRoutes)

app.use(errorHandler)

async function start() {
  try {
    await prisma.$connect()
    logger.info('Database connected')

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