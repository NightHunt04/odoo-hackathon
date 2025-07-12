import { Router } from 'express'
import { 
    handleGetAllUsers, 
    handleBanUser, 
    handlePostPlatformNotifications 
} from '../controllers/admin'

const router = Router()

router.get('/users', handleGetAllUsers)
router.put('/ban/:id', handleBanUser)
router.post('/notification', handlePostPlatformNotifications)

export default router