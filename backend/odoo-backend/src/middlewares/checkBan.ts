import { Request, Response, NextFunction } from 'express'

export function checkBanMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const user = req.user

        if (user.banned) {
            res.status(401).json({ message: 'User banned', success: false })
            return
        }

        next()
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}