import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a banner title'],
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please provide a banner image'],
        },
        buttonText: {
            type: String,
            default: 'Shop Now',
        },
        buttonLink: {
            type: String,
            default: '/shop',
        },
        discount: {
            type: Number,
            min: 0,
            max: 100,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            enum: ['hero', 'offer', 'promotion'],
            default: 'hero',
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
