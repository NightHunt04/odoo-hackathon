import { getAuth } from '@clerk/express'
import { UserModel } from '../models/user'
import { logger } from '../utils/logger'
import { NextFunction, Request, Response } from 'express'

export async function checkUserMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized', success: false })
            return
        }

        const user = await UserModel.findOne({ clerkUserId: userId })

        if (!user) {
            res.status(404).json({ message: 'User not found', success: false })
            return
        }

        // @ts-ignore
        req.user = user
        next()
    } catch (error) {
        logger.error('Check user middleware error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
        return
    }
}