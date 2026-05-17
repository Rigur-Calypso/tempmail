import cron from 'node-cron'
import { prisma } from '../db/prisma'
import { logger } from '../utils/logger'
import { config } from '../config'
import { emitInboxExpired } from '../socket/socket.gateway'

export function startCleanupJob(): void {
  cron.schedule(config.CLEANUP_INTERVAL_CRON, async () => {
    logger.debug('Running inbox cleanup job')

    try {
      const expiredInboxes = await prisma.inbox.findMany({
        where: {
          expiresAt: { lt: new Date() },
        },
        select: { id: true, address: true },
      })

      if (expiredInboxes.length === 0) {
        logger.debug('No expired inboxes found')
        return
      }

      for (const inbox of expiredInboxes) {
        emitInboxExpired(inbox.address)
      }

      const result = await prisma.inbox.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
        },
      })

      logger.info(
        { count: result.count },
        'Cleaned up expired inboxes'
      )
    } catch (error) {
      logger.error({ error }, 'Cleanup job failed')
    }
  })

  logger.info(
    { cron: config.CLEANUP_INTERVAL_CRON },
    'Cleanup job scheduled'
  )
}