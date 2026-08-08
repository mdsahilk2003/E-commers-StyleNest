import express from 'express';
import {
    getAddresses,
    getDefaultAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAddresses).post(createAddress);
router.get('/default', getDefaultAddress);
router.route('/:id').put(updateAddress).delete(deleteAddress);
router.patch('/:id/default', setDefaultAddress);

export default router;
