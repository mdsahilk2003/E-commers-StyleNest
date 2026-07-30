import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a product description'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        sizes: [
            {
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            },
        ],
        colors: [
            {
                type: String,
            },
        ],
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        isNewArrival: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [reviewSchema],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
