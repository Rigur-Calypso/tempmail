import { Server as HttpServer } from 'node:http'
import { Server as SocketServer, Socket } from 'socket.io'
import { config } from '../config'
import { logger } from '../utils/logger'
import { prisma } from '../db/prisma'

let io: SocketServer

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  io.on('connection', (socket: Socket) => {
    logger.debug({ socketId: socket.id }, 'Client connected')

    socket.on('inbox:subscribe', async (address: string) => {
      await handleSubscribe(socket, address)
    })

    socket.on('inbox:unsubscribe', (address: string) => {
      handleUnsubscribe(socket, address)
    })

    socket.on('disconnect', (reason) => {
      logger.debug({ socketId: socket.id, reason }, 'Client disconnected')
    })

    socket.on('error', (error) => {
      logger.error({ socketId: socket.id, error }, 'Socket error')
    })
  })

  logger.info('Socket.IO initialized')
  return io
}

async function handleSubscribe(
  socket: Socket,
  address: string
): Promise<void> {
  if (!address || typeof address !== 'string') {
    socket.emit('error', { message: 'Invalid address' })
    return
  }

  const normalizedAddress = address.toLowerCase().trim()

  try {
    const inbox = await prisma.inbox.findUnique({
      where: { address: normalizedAddress },
      select: { id: true, expiresAt: true, isActive: true },
    })

    if (!inbox) {
      socket.emit('inbox:error', {
        message: 'Inbox not found',
        code: 'NOT_FOUND',
      })
      return
    }

    if (inbox.expiresAt < new Date()) {
      socket.emit('inbox:error', {
        message: 'Inbox has expired',
        code: 'EXPIRED',
      })
      return
    }

    const roomName = `inbox:${normalizedAddress}`
    await socket.join(roomName)

    socket.emit('inbox:subscribed', {
      address: normalizedAddress,
      expiresAt: inbox.expiresAt,
    })

    logger.debug(
      { socketId: socket.id, address: normalizedAddress },
      'Subscribed to inbox'
    )
  } catch (error) {
    logger.error({ error, address }, 'Failed to subscribe to inbox')
    socket.emit('inbox:error', {
      message: 'Failed to subscribe',
      code: 'SERVER_ERROR',
    })
  }
}

function handleUnsubscribe(socket: Socket, address: string): void {
  if (!address || typeof address !== 'string') return

  const roomName = `inbox:${address.toLowerCase().trim()}`
  socket.leave(roomName)

  logger.debug(
    { socketId: socket.id, address },
    'Unsubscribed from inbox'
  )
}

export function emitNewEmail(
  address: string,
  email: EmailPayload
): void {
  if (!io) {
    logger.warn('Socket.IO not initialized — cannot emit email')
    return
  }

  const roomName = `inbox:${address.toLowerCase()}`
  io.to(roomName).emit('email:new', email)

  logger.debug(
    { address, emailId: email.id },
    'Emitted new email to room'
  )
}

export function emitInboxExpired(address: string): void {
  if (!io) return

  const roomName = `inbox:${address.toLowerCase()}`
  io.to(roomName).emit('inbox:expired', { address })
}

export { io }

export interface EmailPayload {
  id: string
  fromAddress: string
  fromName: string | null
  subject: string
  bodyHtml: string | null
  bodyText: string | null
  receivedAt: Date
  isRead: boolean
}