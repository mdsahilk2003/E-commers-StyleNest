import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../backend/config/db.js';
import { notFound, errorHandler } from '../backend/middleware/error.js';

import authRoutes from '../backend/routes/auth.js';
import productRoutes from '../backend/routes/products.js';
import categoryRoutes from '../backend/routes/categories.js';
import orderRoutes from '../backend/routes/orders.js';
import bannerRoutes from '../backend/routes/banner.js';
import adminRoutes from '../backend/routes/admin.js';
import addressRoutes from '../backend/routes/address.js';
import paymentRoutes from '../backend/routes/payment.js';

dotenv.config({ path: './backend/.env' });

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
    res.json({ message: 'StyleNest Unified Serverless API is running!' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
