import { Router } from 'express'
import { 
    handleCreateQuestion, 
    handleGetQuestions, 
    handleCloseQuestion 
} from '../controllers/question'

const router = Router()

router.post('/create', handleCreateQuestion)
router.get('/get', handleGetQuestions)
router.put('/close-toggler/:id', handleCloseQuestion)

export default router