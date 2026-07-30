import express from 'express';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
    .route('/')
    .get(getCategories)
    .post(protect, admin, upload.single('image'), createCategory);

router
    .route('/:id')
    .get(getCategoryById)
    .put(protect, admin, upload.single('image'), updateCategory)
    .delete(protect, admin, deleteCategory);

export default router;
