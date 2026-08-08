import express from 'express';
import {
    register,
    login,
    sendOTP,
    verifyOTP,
    googleAuth,
    getProfile,
    updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleAuth);
router.post('/register', register);
router.post('/login', login);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

export default router;
