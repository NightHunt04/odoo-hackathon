import { Router } from 'express'
import { handleGetSummary, handleChat } from '../controllers/llm'

const router = Router()

router.get('/summary/:questionId', handleGetSummary)
// router.post('/chat/:questionId', handleChat)

export default router