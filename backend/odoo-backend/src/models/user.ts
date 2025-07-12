import { Schema, model, Document } from 'mongoose'

interface IUser extends Document {
    clerkId: string
    username: string
    email: string
    avatar?: string
    name: {
        firstname?: string
        lastname?: string
    }
    askedQuestions: Schema.Types.ObjectId[]
    answers: Schema.Types.ObjectId[]
    role: 'user' | 'admin'
    banned: boolean
}

const UserSchema = new Schema<IUser>({
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    name: {
        firstname: { type: String },
        lastname: { type: String }
    },
    askedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    banned: { type: Boolean, default: false },
}, {
    timestamps: true
})

export const UserModel = model<IUser>('User', UserSchema)

