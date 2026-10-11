import express from 'express';
import { Router } from 'express';
import multer from 'multer';
import { getAllProducts, getProduct, addProducts, updateProduct, deleteProduct } from '../Controllers/productController.js';
import { adminOnly, authMiddleware } from '../Middlewares/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get('/all-products', getAllProducts);
router.get('/:productId', getProduct);

router.post('/add-product', authMiddleware, adminOnly, upload.array('images', 5), addProducts);
router.put('/update-product/:productId', authMiddleware, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/delete-product/:productId', authMiddleware, adminOnly, deleteProduct);

export default router;
