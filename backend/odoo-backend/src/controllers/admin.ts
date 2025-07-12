import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import { QuestionModel } from '../models/question'
import { AnswerModel } from '../models/answer'
import { NotificationModel } from '../models/notification'
import { UserModel } from '../models/user'
import { PlatformNotificationModel } from '../models/platformNotification'

export async function handleGetAllUsers(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user
        const limit = parseInt(req.query.limit as string) || 20
        const page = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * limit

        if (user.role !== 'admin') {
            res.status(401).json({ message: 'Unauthorized', success: false })
            return
        }

        const users = await UserModel
                            .find({})
                            .populate('questions')
                            .populate('answers')
                            .populate('notifications')
                            .skip(skip)
                            .limit(limit)
                            .sort({ createdAt: -1 })
                            .lean()

        logger.info('Users fetched successfully', users)
        res.json({ users, success: true, message: 'Users fetched successfully' })
        return
    } catch (error) {
        logger.error('Get users error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleBanUser(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user
        const userId = req.params.id

        if (user.role !== 'admin') {
            res.status(401).json({ message: 'Unauthorized', success: false })
            return
        }

        const userToBan = await UserModel.findById(userId)

        if (!userToBan) {
            res.status(404).json({ message: 'User not found', success: false })
            return
        }

        await userToBan.updateOne({ banned: true })

        logger.info('User banned successfully')
        res.json({ success: true, message: 'User banned successfully' })
        return
    } catch (error) {
        logger.error('Ban user error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handlePostPlatformNotifications(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user

        if (user.role !== 'admin') {
            res.status(401).json({ message: 'Unauthorized', success: false })
            return
        }

        const { title, description, type } = req.body

        const notification = await PlatformNotificationModel.create({
            title,
            description,
            type
        })

        logger.info('Notification created successfully', notification)
        res.json({ notification, success: true, message: 'Notification created successfully' })
        return
    } catch (error) {
        logger.error('Post platform notifications error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}