import express from 'express';
import { Router } from 'express';
import { addToCart, deleteCart, getMyCart, removeCartItem, updateCartQuantity } from '../Controllers/cartController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = Router();
router.post('/add-to-cart', authMiddleware, addToCart);
router.get('/get-my-cart', authMiddleware, getMyCart);
router.put('/update-cart/:productId', authMiddleware, updateCartQuantity);
router.delete('/remove-cart-item/:productId', authMiddleware, removeCartItem);
router.delete('', authMiddleware, deleteCart);

export default router;
