import { Router } from 'express'
import { handleMailgunWebhook } from '../controllers/webhook.controller'
import { validateMailgunWebhook } from '../middleware/validateWebhook'

const router = Router()

router.post(
  '/mailgun',
  validateMailgunWebhook,
  handleMailgunWebhook
)

export default router