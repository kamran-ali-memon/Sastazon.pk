import express from 'express';
import { Router } from 'express';
import { adminOnly, authMiddleware } from '../Middlewares/authMiddleware.js';
import { createOrder, getAllOrders, getMyOrders, getOrder, updateOrderStatus } from '../Controllers/orderController.js';

const router = Router();
router.post('/createorder', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/admin/all-orders', authMiddleware, adminOnly, getAllOrders);
router.get('/single-order/:orderId', authMiddleware, getOrder);
router.put('/admin/update-order-status/:orderId', authMiddleware, adminOnly, updateOrderStatus);

export default router;
