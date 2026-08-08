import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                size: { type: String },
                color: { type: String },
                variant: { type: String },
                discount: { type: Number, default: 0 },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            altPhone: { type: String, default: '' },
            houseNo: { type: String, required: true },
            street: { type: String, required: true },
            landmark: { type: String, default: '' },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true, default: 'India' },
            type: { type: String, default: 'Home' },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['ONLINE', 'COD', 'Cash on Delivery', 'Online Payment'],
            default: 'COD',
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['PAID', 'UNPAID'],
            default: 'UNPAID',
        },
        paymentDetails: {
            paymentId: { type: String, default: '' },
            transactionId: { type: String, default: '' },
            paidAt: { type: Date },
            gatewayResponse: { type: Object },
            failureReason: { type: String, default: '' },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        discountPrice: {
            type: Number,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: [
                'Pending',
                'Confirmed',
                'Packed',
                'Shipped',
                'Out For Delivery',
                'Delivered',
                'Cancelled',
                'Returned',
            ],
            default: 'Pending',
        },
        trackingTimeline: [
            {
                status: { type: String, required: true },
                title: { type: String, required: true },
                description: { type: String, default: '' },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
