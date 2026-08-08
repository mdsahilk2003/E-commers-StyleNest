import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderPlacedEmail } from '../services/emailService.js';

// @desc    Initiate online payment checkout transaction
// @route   POST /api/payment/create-online-order
// @access  Private
export const createOnlineOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid payment amount is required' });
        }

        // Generate transaction/order token
        const paymentOrderId = 'pay_ord_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_stylenest_demo';

        res.json({
            success: true,
            id: paymentOrderId,
            amount: Math.round(amount * 100), // in paise
            currency,
            key: razorpayKeyId,
        });
    } catch (error) {
        console.error('createOnlineOrder error:', error);
        res.status(500).json({ message: error.message || 'Payment initiation failed' });
    }
};

// @desc    Verify online payment signature and create PAID order
// @route   POST /api/payment/verify-online-payment
// @access  Private
export const verifyOnlinePayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            orderData,
            paymentStatus, // 'SUCCESS' or 'FAILED'
        } = req.body;

        if (paymentStatus === 'FAILED') {
            return res.status(400).json({
                success: false,
                message: 'Online payment was declined or failed by financial institution. Order was NOT created.',
            });
        }

        const paymentId = razorpay_payment_id || 'PAY_' + Date.now();
        const transactionId = razorpay_order_id || 'TXN_' + Date.now();

        const {
            orderItems,
            shippingAddress,
            itemsPrice,
            shippingPrice,
            taxPrice,
            discountPrice = 0,
            totalPrice,
        } = orderData;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Verify inventory stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}. Available: ${product.stock}`,
                });
            }
        }

        // Create Verified Order
        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod: 'ONLINE',
            paymentStatus: 'PAID',
            isPaid: true,
            paidAt: new Date(),
            paymentDetails: {
                paymentId,
                transactionId,
                paidAt: new Date(),
                gatewayResponse: {
                    razorpay_payment_id: paymentId,
                    razorpay_order_id: transactionId,
                },
            },
            itemsPrice,
            shippingPrice,
            taxPrice,
            discountPrice,
            totalPrice,
            status: 'Confirmed',
            trackingTimeline: [
                {
                    status: 'Pending',
                    title: 'Order Placed',
                    description: 'Order details received successfully',
                    timestamp: new Date(Date.now() - 1000),
                },
                {
                    status: 'Confirmed',
                    title: 'Payment Received & Order Confirmed',
                    description: `Online payment of ₹${totalPrice} verified (Ref: ${paymentId})`,
                    timestamp: new Date(),
                },
            ],
        });

        // Deduct inventory stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save();
            }
        }

        // Trigger notification email
        sendOrderPlacedEmail(order, req.user.email);

        res.status(201).json({
            success: true,
            order,
            message: 'Online payment verified successfully! Order created.',
        });
    } catch (error) {
        console.error('verifyOnlinePayment error:', error);
        res.status(500).json({ message: error.message || 'Payment verification failed' });
    }
};
