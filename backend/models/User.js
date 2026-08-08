import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            default: 'User',
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            sparse: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            trim: true,
            sparse: true,
        },
        googleId: {
            type: String,
            sparse: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving if password exists
userSchema.pre('save', async function (next) {
    if (!this.password || !this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
