import { Request, Response, NextFunction } from 'express'
import crypto from 'node:crypto'
import { config } from '../config'
import { logger } from '../utils/logger'

export function validateMailgunWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (config.NODE_ENV === 'development') {
    logger.debug('Skipping webhook validation in development')
    next()
    return
  }

  const timestamp = req.body['timestamp'] as string
  const token = req.body['token'] as string
  const signature = req.body['signature'] as string

  if (!timestamp || !token || !signature) {
    logger.warn('Webhook missing signature fields')
    res.status(401).json({ error: 'Missing signature' })
    return
  }

  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp))
  if (age > 300) {
    logger.warn({ age }, 'Webhook timestamp too old')
    res.status(401).json({ error: 'Timestamp expired' })
    return
  }

  const encodedToken = crypto
    .createHmac('sha256', config.MAILGUN_WEBHOOK_SIGNING_KEY)
    .update(timestamp + token)
    .digest('hex')

  const isValid = crypto.timingSafeEqual(
    Buffer.from(encodedToken),
    Buffer.from(signature)
  )

  if (!isValid) {
    logger.warn('Invalid webhook signature')
    res.status(401).json({ error: 'Invalid signature' })
    return
  }

  logger.debug('Webhook signature verified')
  next()
}