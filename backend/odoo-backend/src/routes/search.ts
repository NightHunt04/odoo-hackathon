import { Router } from 'express'
import { 
    handleSearchByQues, 
    handleSearchByTags 
} from '../controllers/search'

const router = Router()

router.get('/search', handleSearchByQues)
router.post('/search/tags', handleSearchByTags)

export default router