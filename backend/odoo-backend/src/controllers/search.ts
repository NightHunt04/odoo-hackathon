import { Request, Response } from 'express'
import { searchQuestions } from '../utils/pinecone'
import { logger } from '../utils/logger'
import { QuestionModel } from '../models/question'

export async function handleSearchByQues(req: Request, res: Response): Promise<void> {
    try {
        const { query } = req.query

        if (!query) {
            res.status(400).json({ message: 'Query is required', success: false })
            return
        }

        const results = await searchQuestions(query as string)

        logger.info('Search results', results)
        res.json({ results, success: true, message: 'Search results' })
        return
    } catch (error) {
        logger.error('Search error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}

export async function handleSearchByTags(req: Request, res: Response): Promise<void> {
    try {
        const { tags } = req.body

        if (!tags) {
            res.status(400).json({ message: 'Tags are required', success: false })
            return
        }

        const regexPattern = tags.map((tag: string) => tag.trim()).join('|');

        const results = await QuestionModel.find({
            tags: { 
                $elemMatch: { 
                    $regex: regexPattern,
                    $options: 'i'
                }
            }
        }).lean()

        logger.info('Search results by tags', results)
        res.json({ results, success: true, message: 'Search results' })
    } catch (error) {
        logger.error('Search error:', error)
        res.status(500).json({ message: 'Internal server error', success: false })
    }
}