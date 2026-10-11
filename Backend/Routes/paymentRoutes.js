import express from 'express';
import { Router } from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { confirmPayment, createCheckoutSession } from '../Controllers/stripepayment.js';

const router = Router();
router.post('/checkout-session', authMiddleware, createCheckoutSession);
router.post('/confirm-payment', authMiddleware, confirmPayment);

export default router;
