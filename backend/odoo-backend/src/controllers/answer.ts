import { logger } from "../utils/logger"
import { Request, Response } from "express"
import { AnswerModel } from "../models/answer"
import { validateCreateAnswer } from "../utils/validation"

export async function handleCreateAnswer(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user

        const {error, value } = validateCreateAnswer(req.body)

        if (error) {
            res.status(400).json({ message: error.details[0].message, success: false })
            return
        }

        const answer = await AnswerModel.create({
            content: value.content,
            user: user._id,
            question: value.questionId,
            isEdited: false
        })

        logger.info('Answer created successfully', answer)
        res.json({ answer, success: true, message: 'Answer created successfully' })
        return
    } catch (error) {
        logger.error('Create answer error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleGetAnswers(req: Request, res: Response): Promise<void> {
    try {
        const limit = parseInt(req.query.limit as string) || 20
        const page = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * limit

        const answers = await AnswerModel
                                .find({ question: req.params.id })
                                .populate('user')
                                .populate('question')
                                .skip(skip).limit(limit)
                                .sort({ createdAt: -1 })
                                .lean()

        logger.info('Answers fetched successfully', answers)
        res.json({ answers, success: true, message: 'Answers fetched successfully' })
        return
    } catch (error) {
        logger.error('Get answers error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleDeleteAnswer(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user
        const answerId = req.params.answerId

        const answer = await AnswerModel.findOne({ _id: answerId, user: user._id })

        if (!answer) {
            res.status(404).json({ message: 'Answer not found', success: false })
            return
        }

        await answer.deleteOne()

        logger.info('Answer deleted successfully')
        res.json({ success: true, message: 'Answer deleted successfully' })
        return
    } catch (error) {
        logger.error('Delete answer error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleUpvoteAnswer(req: Request, res: Response): Promise<void> {
    try {
        const answerId = req.params.answerId

        const answer = await AnswerModel.findOne({ _id: answerId })

        if (!answer) {
            res.status(404).json({ message: 'Answer not found', success: false })
            return
        }

        await answer.updateOne({ upvotes: answer.upvotes + 1 })

        logger.info('Answer upvoted successfully')
        res.json({ success: true, message: 'Answer upvoted successfully' })
        return
    } catch (error) {
        logger.error('Upvote answer error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleDownvoteAnswer(req: Request, res: Response): Promise<void> {
    try {
        const answerId = req.params.answerId

        const answer = await AnswerModel.findOne({ _id: answerId })

        if (!answer) {
            res.status(404).json({ message: 'Answer not found', success: false })
            return
        }

        await answer.updateOne({ downvotes: answer.downvotes + 1 })

        logger.info('Answer downvoted successfully')
        res.json({ success: true, message: 'Answer downvoted successfully' })
        return
    } catch (error) {
        logger.error('Downvote answer error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleEditAnswer(req: Request, res: Response): Promise<void> {
    try {
        // @ts-ignore
        const user = req.user
        const answerId = req.params.answerId

        const answer = await AnswerModel.findOne({ _id: answerId, user: user._id })

        if (!answer) {
            res.status(404).json({ message: 'Answer not found', success: false })
            return
        }

        await answer.updateOne({ content: req.body.content, isEdited: true })

        logger.info('Answer edited successfully')
        res.json({ success: true, message: 'Answer edited successfully' })
        return
    } catch (error) {
        logger.error('Edit answer error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}