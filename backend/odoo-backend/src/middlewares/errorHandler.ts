import { logger } from '../utils/logger'
import { Request, Response, NextFunction } from 'express'

export async function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    logger.error(err.stack)

    res.status(500).json({
        message: err.message || 'Internal server error'
    })
}