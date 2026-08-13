import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../config/db.js';
import { notFound, errorHandler } from '../middleware/error.js';

import authRoutes from '../routes/auth.js';
import productRoutes from '../routes/products.js';
import categoryRoutes from '../routes/categories.js';
import orderRoutes from '../routes/orders.js';
import bannerRoutes from '../routes/banner.js';
import adminRoutes from '../routes/admin.js';
import addressRoutes from '../routes/address.js';
import paymentRoutes from '../routes/payment.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

connectDB();

app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/banners', '/banners'], bannerRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/addresses', '/addresses'], addressRoutes);
app.use(['/api/payment', '/payment'], paymentRoutes);

app.get(['/api/health', '/health', '/api'], (req, res) => {
    res.json({ message: 'StyleNest Serverless Catch-All API is running!' });
});

app.use(notFound);
app.use(errorHandler);

export default function handler(req, res) {
    return app(req, res);
}
