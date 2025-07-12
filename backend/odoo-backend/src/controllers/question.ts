import { logger } from "../utils/logger"
import { Request, Response } from "express"
import { QuestionModel } from "../models/question"
import { validateCreateQuestion } from '../utils/validation'

export async function handleCreateQuestion(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user

        const {error, value } = validateCreateQuestion(req.body)

        if (error) {
            res.status(400).json({ message: error.details[0].message, success: false })
            return
        }

        const question = await QuestionModel.create({
            title: value.title,
            description: value.description,
            tags: value.tags,
            user: user._id
        })

        logger.info('Question created successfully', question)
        res.json({ question, success: true, message: 'Question created successfully' })
        return
    } catch (error) {
        logger.error('Create question error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}


export async function handleGetQuestions(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        // const user = req.user
        const limit = parseInt(req.query.limit as string) || 20
        const page = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * limit

        const questions = await QuestionModel
                                    .find({})
                                    .populate('user')
                                    .populate('answers')
                                    .skip(skip).limit(limit)

        logger.info('Questions fetched successfully', questions)
        res.json({ questions, success: true, message: 'Questions fetched successfully' })
        return
    } catch (error) {
        logger.error('Get questions error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleCloseQuestion(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user
        const questionId = req.params.id

        const question = await QuestionModel.findOne({ _id: questionId, user: user._id })

        if (!question) {
            res.status(404).json({ message: 'Question not found', success: false })
            return
        }

        await question.updateOne({ closed: !question.closed })

        logger.info('Question closed successfully')
        res.json({ success: true, message: 'Question closed successfully' })
        return
    } catch (error) {
        logger.error('Close question error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}