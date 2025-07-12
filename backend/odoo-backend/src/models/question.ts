import { Schema, Document, model } from 'mongoose'

export interface IQuestion extends Document {
    title: string
    description: Object
    tags: string[]
    user: Schema.Types.ObjectId
    answers: Schema.Types.ObjectId[]
    closed: boolean
}

const QuestionSchema = new Schema<IQuestion>({
    title: { type: String, required: true },
    description: { type: Object, required: true },
    tags: [{ type: String }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    closed: { type: Boolean, default: false },
}, { timestamps: true })

QuestionSchema.index({ title: 'text', description: 'text', tags: 1 })

export const QuestionModel = model<IQuestion>('Question', QuestionSchema)
