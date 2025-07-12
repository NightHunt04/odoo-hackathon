import { UserModel } from "../models/user"  
import { logger } from "../utils/logger"
import { Request, Response } from "express"
import { getAuth } from "@clerk/express"

export async function handleGetUser(req: Request, res: Response): Promise<void> {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized', success: false })
            return
        }

        const user = await UserModel.findById(userId)

        if (!user) {
            res.status(404).json({ message: 'User not found', success: false })
            return
        }

        const userToShow = await UserModel
                                    .findById(req.params.id)
                                    .populate('askedQuestions')
                                    .populate('answers')

        if (!userToShow) {
            res.status(404).json({ message: 'User not found', success: false })
            return
        }

        logger.info('User found')
        res.json({ user: userToShow, success: true, message: 'User found' })
        return
    } catch (error) {
        logger.error('Get user error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
        return
    }
}