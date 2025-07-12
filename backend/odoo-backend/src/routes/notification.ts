import { Router } from 'express'
import { 
    handleGetNotifications, 
    handleMarkNotificationAsRead 
} from '../controllers/notification'

const router = Router()

router.get('/', handleGetNotifications)
router.put('/mark-as-read/:id', handleMarkNotificationAsRead)

export default router