import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load env vars
dotenv.config();

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

const testConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('\n✅ MongoDB Connected Successfully!');
        console.log('📍 Host:', conn.connection.host);
        console.log('📊 Database:', conn.connection.name);
        console.log('🔌 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Not Connected');

        // List collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('\n📁 Collections in database:');
        if (collections.length === 0) {
            console.log('   (No collections yet - database is empty)');
        } else {
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
        }

        console.log('\n✅ Connection test successful! You can now use login/register.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Connection Failed!');
        console.error('Error:', error.message);
        process.exit(1);
    }
};

testConnection();
