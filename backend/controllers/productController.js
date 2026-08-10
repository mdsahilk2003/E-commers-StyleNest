import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, search, isNewArrival, isFeatured, sort } = req.query;

        let query = { isActive: true };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by search term
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by new arrivals
        if (isNewArrival === 'true') {
            query.isNewArrival = true;
        }

        // Filter by featured
        if (isFeatured === 'true') {
            query.isFeatured = true;
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price-asc') {
            sortOption.price = 1;
        } else if (sort === 'price-desc') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        } else {
            sortOption.createdAt = -1;
        }

        const products = await Product.find(query)
            .sort(sortOption);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        let product = null;
        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        }
        if (product) {
            return res.json(product);
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('getProductById error:', error);
        res.status(500).json({ message: error.message || 'Error fetching product' });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            category,
            sizes,
            colors,
            stock,
            isNewArrival,
            isFeatured,
        } = req.body;

        // Upload images to Cloudinary
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {


                // Convert buffer to base64
                const base64 = file.buffer.toString('base64');
                const dataURI = `data:${file.mimetype};base64,${base64}`;

                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    folder: 'your-website/products',
                });

                imageUrls.push(uploadResult.secure_url);
            }
        }

        const product = await Product.create({
            name,
            description,
            price,
            discountPrice,
            category,
            images: imageUrls,
            sizes: sizes ? JSON.parse(sizes) : [],
            colors: colors ? JSON.parse(colors) : [],
            stock,
            isNewArrival: isNewArrival === 'true',
            isFeatured: isFeatured === 'true',
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message || error.toString() });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const {
            name,
            description,
            price,
            discountPrice,
            category,
            sizes,
            colors,
            stock,
            isNewArrival,
            isFeatured,
            isActive,
        } = req.body;

        // Update images if new ones are uploaded
        let imageUrls = product.images;
        if (req.files && req.files.length > 0) {
            imageUrls = [];
            for (const file of req.files) {
                const base64 = file.buffer.toString('base64');
                const dataURI = `data:${file.mimetype};base64,${base64}`;

                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    folder: 'your-website/products',
                });

                imageUrls.push(uploadResult.secure_url);
            }
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
        product.category = category || product.category;
        product.images = imageUrls;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.colors = colors ? JSON.parse(colors) : product.colors;
        product.stock = stock !== undefined ? stock : product.stock;
        product.isNewArrival = isNewArrival !== undefined ? isNewArrival === 'true' : product.isNewArrival;
        product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured;
        product.isActive = isActive !== undefined ? isActive === 'true' : product.isActive;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message || error.toString() });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
