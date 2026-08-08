import express from 'express';
import { createOnlineOrder, verifyOnlinePayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/create-online-order', createOnlineOrder);
router.post('/verify-online-payment', verifyOnlinePayment);

export default router;
