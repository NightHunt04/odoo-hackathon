import { config } from 'dotenv'
config()
import express, { Express, Request, Response } from "express"
import cors from 'cors'
import helmet from "helmet"
import { clerkMiddleware, requireAuth } from '@clerk/express'

// utils
import { logger } from './utils/logger'
import { errorHandler } from './middlewares/errorHandler'
import { connectMongo } from './utils/mongo'

// routes
import authRouter from './routes/auth'
import questionRouter from './routes/question'
import answerRouter from './routes/answer'
import notificationRouter from './routes/notification'

import { checkUserMiddleware } from './middlewares/checkUser'
import { checkBanMiddleware } from './middlewares/checkBan'

const app: Express = express()

const PORT = process.env.PORT || 8000

async function server() {
    try {
        // middlewares
        app.use(cors())
        app.use(helmet())
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(clerkMiddleware())
        app.use('/api', requireAuth())
        app.use('/api', checkUserMiddleware, checkBanMiddleware)

        // routes
        app.use('/api/auth', authRouter)
        app.use('/api/question', questionRouter)
        app.use('/api/answer', answerRouter)
        app.use('/api/notification', notificationRouter)

        app.use(errorHandler)

        // connect to mongo
        connectMongo()

        app.get('/ping', (_req: Request, res: Response) => {
            logger.info('Ping request received')
            res.send('pong')
        })

        app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))
    } catch (error) {
        logger.error('Server error:', error)
    }
}

server()

process.on('unhandledRejection', (reason: any, promise: any) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
})

export default app