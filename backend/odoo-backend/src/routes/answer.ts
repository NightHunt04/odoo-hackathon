import { Router } from 'express'
import { 
    handleCreateAnswer, 
    handleGetAnswers, 
    handleDeleteAnswer, 
    handleUpvoteAnswer, 
    handleDownvoteAnswer, 
    handleEditAnswer 
} from '../controllers/answer'

const router = Router()

router.post('/create', handleCreateAnswer)
router.get('/:id', handleGetAnswers)
router.delete('/delete/:answerId', handleDeleteAnswer)
router.put('/upvote/:answerId', handleUpvoteAnswer)
router.put('/downvote/:answerId', handleDownvoteAnswer)
router.put('/edit/:answerId', handleEditAnswer)

export default router