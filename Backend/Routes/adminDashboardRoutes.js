import express from 'express';
import { Router } from 'express';
import { adminOnly, authMiddleware } from '../Middlewares/authMiddleware.js';
import { adminDashboard, getAllUsers } from '../Controllers/adminPanel.js';

const router = Router();
router.get('/dashboard', authMiddleware, adminOnly, adminDashboard);
router.get('/dashboard/all-users', authMiddleware, adminOnly, getAllUsers);

export default router;
