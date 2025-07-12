import mongoose from "mongoose"
import { logger } from '../utils/logger'

let isConnected = false

export async function connectMongo() {
    try {
        if (!process.env.MONGO_ATLAS_URI) {
            throw new Error('Missing MONGO_ATLAS_URI environment variable')
        }
        if (isConnected) {
            logger.info('MongoDB already connected')
            return
        }
        await mongoose.connect(process.env.MONGO_ATLAS_URI)
        logger.info('MongoDB connected')
        isConnected = true
    } catch (error) {
        logger.error('MongoDB connection error:', error)
    }
}