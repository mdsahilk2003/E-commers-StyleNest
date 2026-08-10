import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

console.log('\n🚀 TEMPORARY BACKEND SERVER (No MongoDB Required)\n');
console.log('⚠️  This is a temporary solution for testing login.');
console.log('📝 For permanent solution, whitelist IP in MongoDB Atlas.\n');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, 'setia_collection_super_secret_jwt_key_2024_change_in_production', {
        expiresIn: '30d',
    });
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        message: 'SETIA COLLECTION API is running!',
        mode: 'TEMPORARY (No MongoDB)',
        timestamp: new Date()
    });
});

// Login endpoint - Flexible mock login (Admin & Mobile Number support)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, identifier, phone, password } = req.body;
        const inputStr = (identifier || email || phone || '').trim();

        console.log(`🔐 Login attempt: ${inputStr}`);

        const isAdmin = inputStr === 'admin@gmail.com' || inputStr === '9006659008' || inputStr.endsWith('9006659008');
        const isAllowedPass = ['Admin@000', 'Sahil@725492', 'admin123', 'Admin@123'].includes(password);

        if (isAdmin || isAllowedPass) {
            const adminUser = {
                _id: 'admin-hardcoded-id',
                name: 'Admin',
                email: 'admin@gmail.com',
                phone: '9006659008',
                role: 'admin',
                token: generateToken('admin-hardcoded-id'),
            };
            console.log('✅ Admin login successful!\n');
            return res.json(adminUser);
        }

        if (inputStr && password) {
            const mockUser = {
                _id: `user-${Date.now()}`,
                name: 'User',
                email: inputStr.includes('@') ? inputStr : '',
                phone: !inputStr.includes('@') ? inputStr : '',
                role: 'user',
                token: generateToken(`user-${Date.now()}`),
            };
            console.log('✅ User login successful!\n');
            return res.json(mockUser);
        }

        console.log('❌ Login failed - invalid credentials\n');
        res.status(401).json({ message: 'Invalid mobile number/email or password' });
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Register endpoint - Temporary message
app.post('/api/auth/register', async (req, res) => {
    res.status(503).json({
        message: 'Registration temporarily disabled. Please whitelist IP in MongoDB Atlas first.'
    });
});

// Profile endpoint
app.get('/api/auth/profile', (req, res) => {
    res.json({
        _id: 'admin-hardcoded-id',
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin',
    });
});

// Catch all
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log('========================================');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('========================================');
    console.log('\n📍 Available endpoints:');
    console.log(`   - Health: http://localhost:${PORT}/api/health`);
    console.log(`   - Login:  http://localhost:${PORT}/api/auth/login`);
    console.log('\n🔐 Test login with:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: Admin@000');
    console.log('\n⚠️  IMPORTANT: This is temporary!');
    console.log('   Whitelist IP in MongoDB Atlas for full functionality.');
    console.log('========================================\n');
});
