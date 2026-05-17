import { prisma } from '../db/prisma'
import { logger } from '../utils/logger'
import { emitNewEmail } from '../socket/socket.gateway'
import type { ParsedEmail } from './email-parser.service'

export async function saveEmail(parsed: ParsedEmail): Promise<void> {
  const inbox = await prisma.inbox.findUnique({
    where: { address: parsed.recipient },
    select: {
      id: true,
      address: true,
      expiresAt: true,
      isActive: true,
    },
  })

  if (!inbox) {
    logger.warn(
      { recipient: parsed.recipient },
      'Email arrived for unknown inbox — ignoring'
    )
    return
  }

  if (inbox.expiresAt < new Date()) {
    logger.warn(
      { recipient: parsed.recipient },
      'Email arrived for expired inbox — ignoring'
    )
    return
  }

  if (!inbox.isActive) {
    logger.warn(
      { recipient: parsed.recipient },
      'Email arrived for inactive inbox — ignoring'
    )
    return
  }

  const email = await prisma.email.create({
    data: {
      inboxId: inbox.id,
      fromAddress: parsed.fromAddress,
      fromName: parsed.fromName,
      subject: parsed.subject,
      bodyHtml: parsed.bodyHtml,
      bodyText: parsed.bodyText,
    },
  })

  logger.info(
    { emailId: email.id, inboxAddress: inbox.address },
    'Email saved'
  )

  emitNewEmail(inbox.address, {
    id: email.id,
    fromAddress: email.fromAddress,
    fromName: email.fromName,
    subject: email.subject,
    bodyHtml: email.bodyHtml,
    bodyText: email.bodyText,
    receivedAt: email.receivedAt,
    isRead: false,
  })
}