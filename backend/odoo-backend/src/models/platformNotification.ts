import { Schema, model, Document } from 'mongoose'

interface PlatformNotification extends Document {
    title: string
    description: string
    type: string
}

const platformNotificationSchema = new Schema<PlatformNotification>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true }
})

export const PlatformNotificationModel = model<PlatformNotification>('PlatformNotification', platformNotificationSchema)

