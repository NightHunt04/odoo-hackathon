import { AnswerModel } from '../models/answer'
import { logger } from '../utils/logger'
import { Request, Response } from 'express'
import { ai, config } from '../utils/gemini'
import { searchAnswers } from '../utils/pinecone'

export async function handleGetSummary(req: Request, res: Response): Promise<void> {
    try {
        const { questionId } = req.params

        const answer = await AnswerModel.find({ question: questionId })

        if (!answer) {
            res.status(404).json({ message: 'Answer not found', success: false })
            return
        }

        const contents = [{
            role: 'user',
            content: `Here are the answers to the question summarise them to me: ${questionId}. ${answer.map((answer) => answer.content).join('\n')} \nDo not give any text such as 'Sure here is your summary', only provide me summarised answer.`
        }]
        const summary = await ai.models.generateContent({ model: 'gemini-2.0-flash-exp', config, contents })

        logger.info('Answer summary', summary)
        res.json({ summary: summary.text, success: true, message: 'Answer summary' })
        return
    } catch (error) {
        logger.error('Get answer summary error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleChat(req: Request, res: Response): Promise<void> {
    try {
        const { questionId } = req.params
        const { message } = req.body

        const answers = await searchAnswers(message)

        console.log(answers)

        if (!answers) {
            res.status(404).json({ message: 'Answer not found', success: false })
            return
        }

        
        // const summary = await ai.models.generateContent({ model: 'gemini-2.0-flash-exp', config, contents })

        logger.info('Answer summary')
        res.json({  success: true, message: 'Answer summary' })
        return
    } catch (error) {
        logger.error('Get answer summary error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}