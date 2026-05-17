import rateLimit from 'express-rate-limit'
import { config } from '../config'

export const inboxCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: config.MAX_INBOXES_PER_IP_PER_HOUR,
  message: {
    success: false,
    error: 'Too many inboxes created from this IP. Try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    error: 'Too many requests. Slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})