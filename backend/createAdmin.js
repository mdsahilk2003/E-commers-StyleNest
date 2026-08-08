// Script to create/update admin user in database
// Run this file once: node createAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        let admin = await User.findOne({ $or: [{ email: 'admin@gmail.com' }, { phone: '9006659008' }] });

        if (admin) {
            admin.name = 'Admin';
            admin.email = 'admin@gmail.com';
            admin.phone = '9006659008';
            admin.password = 'Sahil@725492';
            admin.role = 'admin';
            await admin.save();
            console.log('✅ Admin user updated in database!');
        } else {
            admin = await User.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                phone: '9006659008',
                password: 'Sahil@725492',
                role: 'admin',
            });
            console.log('✅ Admin user created in database!');
        }

        console.log('📱 Phone: 9006659008');
        console.log('📧 Email: admin@gmail.com');
        console.log('🔑 Password: Sahil@725492');
        console.log('👤 Role: admin');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();

