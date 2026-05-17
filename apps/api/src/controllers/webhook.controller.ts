import { Request, Response, NextFunction } from 'express'
import { parseMailgunPayload } from '../services/email-parser.service'
import { saveEmail } from '../services/email.service'
import { logger } from '../utils/logger'

export async function handleMailgunWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    logger.debug('Mailgun webhook received')

    const parsed = parseMailgunPayload(
      req.body as Record<string, string>
    )

    if (!parsed.recipient) {
      logger.warn('Webhook has no recipient — ignoring')
      res.status(200).json({ ok: true })
      return
    }

    await saveEmail(parsed)

    res.status(200).json({ ok: true })
  } catch (error) {
    next(error)
  }
}