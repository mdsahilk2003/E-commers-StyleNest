import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const testDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');
        
        try {
            const product = await Product.create({
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                category: 'Accessories',
                images: [],
                sizes: [],
                colors: [],
                stock: 10,
                isNewArrival: false,
                isFeatured: false,
            });
            console.log('✅ PRODUCT CREATION SUCCEEDED:', product._id);
        } catch (e) {
            console.error('❌ PRODUCT CREATION FAILED:', e.message);
            console.error('Details:', e);
        }
        process.exit();
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}
testDb();
