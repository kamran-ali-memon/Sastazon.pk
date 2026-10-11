import { Router } from 'express'

import {
    login,
    register,
    resendOtp,
    verifyOtp,
    getCurrentUser,
    logout
} from '../Controllers/authController.js'

import { authMiddleware } from '../Middlewares/authMiddleware.js'


const router = Router()


router.post('/register', register)

router.post('/verify-otp', verifyOtp)

router.post('/resend-otp', resendOtp)

router.post('/login', login)

router.get('/me', authMiddleware, getCurrentUser)

router.post('/logout', logout)


export default router
