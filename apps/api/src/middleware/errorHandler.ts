import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn({ err, statusCode: err.statusCode }, err.message)
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    })
    return
  }

  logger.error({ err }, 'Unhandled error')
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
}