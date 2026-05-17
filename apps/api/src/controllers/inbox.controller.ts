import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import {
  createInbox,
  getInbox,
  deleteInbox,
} from '../services/inbox.service'
import { AppError } from '../middleware/errorHandler'

const createInboxSchema = z.object({
  customAlias: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9._-]+$/, 'Alias can only contain lowercase letters, numbers, dots, hyphens, underscores')
    .optional(),
  expiryMinutes: z
    .number()
    .min(5)
    .max(1440)
    .optional(),
})

export async function handleCreateInbox(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = createInboxSchema.safeParse(req.body)

    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0].message,
        400
      )
    }

    const ipAddress =
      req.ip ??
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ??
      'unknown'

    const inbox = await createInbox({
      ipAddress,
      customAlias: parsed.data.customAlias,
      expiryMinutes: parsed.data.expiryMinutes,
    })

    res.status(201).json({
      success: true,
      data: inbox,
    })
  } catch (error) {
    next(error)
  }
}

export async function handleGetInbox(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { address } = req.params

    if (!address || !address.includes('@')) {
      throw new AppError('Invalid email address format', 400)
    }

    const inbox = await getInbox(address.toLowerCase())

    res.json({
      success: true,
      data: inbox,
    })
  } catch (error) {
    next(error)
  }
}

export async function handleDeleteInbox(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { address } = req.params

    if (!address || !address.includes('@')) {
      throw new AppError('Invalid email address format', 400)
    }

    await deleteInbox(address.toLowerCase())

    res.json({
      success: true,
      message: 'Inbox deleted',
    })
  } catch (error) {
    next(error)
  }
}