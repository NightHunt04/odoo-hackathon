import { Schema, Document, model } from 'mongoose'

interface IAnswer extends Document {
    content: Object
    user: Schema.Types.ObjectId
    question: Schema.Types.ObjectId
    upvotes: number
    downvotes: number
    isEdited: boolean
}

const AnswerSchema = new Schema<IAnswer>({
    content: { type: Object, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
}, { timestamps: true })

export const AnswerModel = model<IAnswer>('Answer', AnswerSchema)
