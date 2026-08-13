import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from '../backend/routes/auth.js';
import productRoutes from '../backend/routes/products.js';
import categoryRoutes from '../backend/routes/categories.js';
import orderRoutes from '../backend/routes/orders.js';
import bannerRoutes from '../backend/routes/banner.js';
import adminRoutes from '../backend/routes/admin.js';
import addressRoutes from '../backend/routes/address.js';
import paymentRoutes from '../backend/routes/payment.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kausharkhatoon445_db_user:2rvCQ7JXfaX4pAKL@cluster0.sxmljku.mongodb.net/setia-collection?retryWrites=true&w=majority';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

let isConnected = false;

app.use(async (req, res, next) => {
    try {
        if (!isConnected && mongoose.connection.readyState < 1) {
            await mongoose.connect(MONGODB_URI.trim(), {
                serverSelectionTimeoutMS: 5000,
            });
            isConnected = true;
        }
        next();
    } catch (err) {
        console.error('MongoDB connection error in serverless function:', err.message);
        next();
    }
});

app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/banners', '/banners'], bannerRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/addresses', '/addresses'], addressRoutes);
app.use(['/api/payment', '/payment'], paymentRoutes);

app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
    res.json({ message: 'StyleNest API is running cleanly!' });
});

app.use((req, res) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

export default function handler(req, res) {
    return app(req, res);
}
