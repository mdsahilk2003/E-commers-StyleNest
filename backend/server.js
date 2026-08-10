import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import bannerRoutes from './routes/banner.js';
import adminRoutes from './routes/admin.js';
import addressRoutes from './routes/address.js';
import paymentRoutes from './routes/payment.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : '';
            if (
                origin === frontendUrl ||
                origin.endsWith('.vercel.app') ||
                origin.includes('localhost') ||
                process.env.NODE_ENV !== 'production'
            ) {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);

// API Routes (supports both /api/ route and direct serverless route)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/banners', '/banners'], bannerRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/addresses', '/addresses'], addressRoutes);
app.use(['/api/payment', '/payment'], paymentRoutes);

// Health check route
app.get(['/api/health', '/health', '/'], (req, res) => {
    res.json({ message: 'StyleNest API is running!' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

export default app;
