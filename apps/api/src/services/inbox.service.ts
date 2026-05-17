import { prisma } from '../db/prisma'
import { generateAddress } from '../utils/generate-address'
import { AppError } from '../middleware/errorHandler'
import { config } from '../config'
import { logger } from '../utils/logger'

const DEFAULT_DOMAIN = 'localhost'

export interface CreateInboxOptions {
  ipAddress?: string
  customAlias?: string
  expiryMinutes?: number
}

export interface InboxResponse {
  id: string
  address: string
  expiresAt: Date
  createdAt: Date
  emailCount: number
}

export async function createInbox(
  options: CreateInboxOptions = {}
): Promise<InboxResponse> {
  const {
    ipAddress,
    customAlias,
    expiryMinutes = config.DEFAULT_INBOX_EXPIRY_MINUTES,
  } = options

  let domain = await prisma.domain.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  })

  if (!domain) {
    logger.warn('No active domain found, creating default')
    domain = await prisma.domain.create({
      data: { name: DEFAULT_DOMAIN, isActive: true },
    })
  }

  let address: string
  let attempts = 0
  const maxAttempts = 10

  if (customAlias) {
    address = `${customAlias}@${domain.name}`
    const existing = await prisma.inbox.findUnique({
      where: { address },
    })
    if (existing) {
      throw new AppError('This alias is already taken', 409)
    }
  } else {
    do {
      address = generateAddress(domain.name)
      const existing = await prisma.inbox.findUnique({
        where: { address },
      })
      if (!existing) break
      attempts++
    } while (attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      throw new AppError('Failed to generate unique address', 500)
    }
  }

  const expiresAt = new Date(
    Date.now() + expiryMinutes * 60 * 1000
  )

  const inbox = await prisma.inbox.create({
    data: {
      address,
      domainId: domain.id,
      expiresAt,
      ipCreatedFrom: ipAddress,
    },
  })

  logger.info({ inboxId: inbox.id, address }, 'Inbox created')

  return {
    id: inbox.id,
    address: inbox.address,
    expiresAt: inbox.expiresAt,
    createdAt: inbox.createdAt,
    emailCount: 0,
  }
}

export async function getInbox(
  address: string
): Promise<InboxResponse & { emails: EmailSummary[] }> {
  const inbox = await prisma.inbox.findUnique({
    where: { address },
    include: {
      emails: {
        orderBy: { receivedAt: 'desc' },
        select: {
          id: true,
          fromAddress: true,
          fromName: true,
          subject: true,
          isRead: true,
          receivedAt: true,
        },
      },
    },
  })

  if (!inbox) {
    throw new AppError('Inbox not found', 404)
  }

  if (inbox.expiresAt < new Date()) {
    throw new AppError('Inbox has expired', 410)
  }

  return {
    id: inbox.id,
    address: inbox.address,
    expiresAt: inbox.expiresAt,
    createdAt: inbox.createdAt,
    emailCount: inbox.emails.length,
    emails: inbox.emails,
  }
}

export async function deleteInbox(address: string): Promise<void> {
  const inbox = await prisma.inbox.findUnique({
    where: { address },
  })

  if (!inbox) {
    throw new AppError('Inbox not found', 404)
  }

  await prisma.inbox.delete({
    where: { address },
  })

  logger.info({ address }, 'Inbox deleted')
}

interface EmailSummary {
  id: string
  fromAddress: string
  fromName: string | null
  subject: string
  isRead: boolean
  receivedAt: Date
}