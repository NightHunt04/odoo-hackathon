import { Router } from 'express'
import { handleSigninUser } from '../controllers/auth'

const router = Router()

router.post('/signin', handleSigninUser)

export default router