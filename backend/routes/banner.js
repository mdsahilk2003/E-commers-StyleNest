import express from 'express';
import {
    getBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
    .route('/')
    .get(getBanners)
    .post(protect, admin, upload.single('image'), createBanner);

router
    .route('/:id')
    .get(getBannerById)
    .put(protect, admin, upload.single('image'), updateBanner)
    .delete(protect, admin, deleteBanner);

export default router;
