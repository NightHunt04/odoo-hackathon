import { Request, Response } from 'express'
import { NotificationModel } from '../models/notification'
import { logger } from '../utils/logger'

export async function handleGetNotifications(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user

        const notifications = await NotificationModel.find({ user: user._id }).sort({ createdAt: -1 })

        logger.info('Notifications fetched successfully', notifications)
        res.json({ notifications, success: true, message: 'Notifications fetched successfully' })
        return
    } catch (error) {
        logger.error('Get notifications error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleMarkNotificationAsRead(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user
        const notificationId = req.params.id

        const notification = await NotificationModel.findOne({ _id: notificationId, user: user._id })

        if (!notification) {
            res.status(404).json({ message: 'Notification not found', success: false })
            return
        }

        await notification.updateOne({ isRead: true })

        logger.info('Notification marked as read successfully')
        res.json({ success: true, message: 'Notification marked as read successfully' })
        return
    } catch (error) {
        logger.error('Mark notification as read error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}