import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('🔍 Testing Backend Configuration...\n');

// Test MongoDB Connection
const testMongoDB = async () => {
    try {
        console.log('📊 MongoDB URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected:', conn.connection.host);
        console.log('📁 Database:', conn.connection.name);
        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        return false;
    }
};

// Test Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    // Test hardcoded admin
    if (email === 'admin@gmail.com' && password === 'Admin@000') {
        console.log('✅ Admin login successful');
        return res.json({
            _id: 'admin-id',
            name: 'Admin',
            email: 'admin@gmail.com',
            role: 'admin',
            token: 'test-token-123'
        });
    }

    console.log('❌ Login failed - invalid credentials');
    res.status(401).json({ message: 'Invalid email or password' });
});

app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date() });
});

const startServer = async () => {
    const mongoOk = await testMongoDB();

    if (!mongoOk) {
        console.log('\n⚠️  MongoDB connection failed, but starting server anyway for testing...\n');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`\n🚀 Test Server Running on http://localhost:${PORT}`);
        console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`🔐 Login Endpoint: http://localhost:${PORT}/api/auth/login`);
        console.log('\n✅ Server is ready! Try logging in now.\n');
    });
};

startServer();
