import mongoose, { Document, Schema } from 'mongoose'

interface INotification extends Document {
    user: Schema.Types.ObjectId
    message: string
    link: string
    isRead: boolean    
}

const NotificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    link: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true })

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema)
