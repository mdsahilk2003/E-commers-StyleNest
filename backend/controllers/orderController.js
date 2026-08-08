import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderPlacedEmail, sendOrderStatusEmail } from '../services/emailService.js';

// @desc    Create new order (COD or direct)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod = 'COD',
            itemsPrice,
            shippingPrice,
            taxPrice,
            discountPrice = 0,
            totalPrice,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Verify stock availability
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

        const isOnline = paymentMethod === 'ONLINE' || paymentMethod === 'Online Payment';
        const methodCode = isOnline ? 'ONLINE' : 'COD';
        const initialPaymentStatus = isOnline ? 'PAID' : 'UNPAID';

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod: methodCode,
            paymentStatus: initialPaymentStatus,
            isPaid: isOnline,
            paidAt: isOnline ? new Date() : undefined,
            itemsPrice,
            shippingPrice,
            taxPrice,
            discountPrice,
            totalPrice,
            status: 'Pending',
            trackingTimeline: [
                {
                    status: 'Pending',
                    title: 'Order Placed',
                    description: isOnline ? 'Online payment completed' : 'Order placed via Cash on Delivery',
                    timestamp: new Date(),
                },
            ],
        });

        // Update product stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save();
            }
        }

        const createdOrder = await order.populate('user', 'name email phone');

        // Trigger Order Placed Email
        sendOrderPlacedEmail(createdOrder, req.user.email);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('orderItems.product', 'name image price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isOwner = order.user._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (isOwner || isAdmin) {
            res.json(order);
        } else {
            res.status(403).json({ message: 'Not authorized to view this order' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const validStatuses = [
            'Pending',
            'Confirmed',
            'Packed',
            'Shipped',
            'Out For Delivery',
            'Delivered',
            'Cancelled',
            'Returned',
        ];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status: ${status}` });
        }

        order.status = status || order.status;

        // AUTOMATIC COD PAYMENT STATUS RULE:
        // When Admin marks a COD order as 'Delivered', automatically update paymentStatus from UNPAID to PAID
        const isCOD = order.paymentMethod === 'COD' || order.paymentMethod === 'Cash on Delivery';
        if (order.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();

            if (isCOD && order.paymentStatus === 'UNPAID') {
                order.paymentStatus = 'PAID';
                order.isPaid = true;
                order.paidAt = new Date();
                console.log(`[AUTO PAYMENT UPDATE] Order #${order._id} marked Delivered. COD Payment Status updated to PAID.`);
            }
        }

        // Push entry into tracking timeline if not present
        const timelineTitles = {
            Pending: 'Order Placed',
            Confirmed: 'Order Confirmed',
            Packed: 'Order Packed & Prepared',
            Shipped: 'Order Shipped via Courier',
            'Out For Delivery': 'Package Out For Delivery',
            Delivered: 'Order Delivered Successfully',
            Cancelled: 'Order Cancelled',
            Returned: 'Order Item Returned',
        };

        const existingTimeline = order.trackingTimeline || [];
        const hasStatusInTimeline = existingTimeline.some((item) => item.status === order.status);

        if (!hasStatusInTimeline) {
            existingTimeline.push({
                status: order.status,
                title: timelineTitles[order.status] || order.status,
                description: `Order status updated to ${order.status}`,
                timestamp: new Date(),
            });
            order.trackingTimeline = existingTimeline;
        }

        const updatedOrder = await order.save();

        // Dispatch Email Notification
        sendOrderStatusEmail(updatedOrder, updatedOrder.status);

        res.json(updatedOrder);
    } catch (error) {
        console.error('updateOrderStatus error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order payment status manually (Admin)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = 'PAID';
        order.isPaid = true;
        order.paidAt = new Date();
        if (req.body.paymentId) {
            order.paymentDetails = {
                paymentId: req.body.paymentId,
                transactionId: req.body.transactionId || '',
                paidAt: new Date(),
            };
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
