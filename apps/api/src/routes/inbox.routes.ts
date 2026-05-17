import { Router } from 'express'
import {
  handleCreateInbox,
  handleGetInbox,
  handleDeleteInbox,
} from '../controllers/inbox.controller'
import { inboxCreationLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/', inboxCreationLimiter, handleCreateInbox)
router.get('/:address', handleGetInbox)
router.delete('/:address', handleDeleteInbox)

export default router