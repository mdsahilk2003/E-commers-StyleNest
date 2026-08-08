import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fullName: {
            type: String,
            required: [true, 'Please provide full name'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide a 10-digit mobile number'],
            trim: true,
        },
        altPhone: {
            type: String,
            trim: true,
            default: '',
        },
        houseNo: {
            type: String,
            required: [true, 'Please provide House/Flat No.'],
            trim: true,
        },
        street: {
            type: String,
            required: [true, 'Please provide Street/Area details'],
            trim: true,
        },
        landmark: {
            type: String,
            trim: true,
            default: '',
        },
        city: {
            type: String,
            required: [true, 'Please provide City'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'Please provide State'],
            trim: true,
        },
        zipCode: {
            type: String,
            required: [true, 'Please provide PIN Code'],
            trim: true,
        },
        country: {
            type: String,
            required: true,
            default: 'India',
        },
        type: {
            type: String,
            enum: ['Home', 'Work', 'Other'],
            default: 'Home',
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Before saving default address, unset other default addresses for user
addressSchema.pre('save', async function (next) {
    if (this.isDefault && this.isModified('isDefault')) {
        await mongoose.model('Address').updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { $set: { isDefault: false } }
        );
    }
    next();
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
