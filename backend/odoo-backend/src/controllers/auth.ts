import { getAuth } from '@clerk/express'
import { UserModel } from '../models/user'
import { logger } from '../utils/logger'
import { clerkClient } from '@clerk/express'
import { Request, Response } from 'express'

export async function handleSigninUser(req: Request, res: Response): Promise<void> {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized', success: false })
            return
        }
        
        const user = await clerkClient.users.getUser(userId)

        if (!user) {
            res.status(404).json({ message: 'User not found', success: false })
            return
        }

        const userExists = await UserModel.findOne({ clerkId: userId })

        if (userExists) {
            res.json({ message: 'User already exists', success: true })
            return
        }
        
        const newUser = await UserModel.create({
            clerkId: userId,
            username: user.username,
            email: user.emailAddresses.map(email => email.emailAddress),
            avatarUrl: user.imageUrl,
            name: {
                firstName: user.firstName,
                lastName: user.lastName
            },
            role: 'user',
            banned: false
        })

        logger.info('User signed in successfully', newUser)
        res.json({ message: 'User signed in successfully', success: true })
        return
    } catch (error) {
        logger.error('Signin user error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}