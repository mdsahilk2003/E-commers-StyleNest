import Banner from '../models/Banner.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res) => {
    try {
        const { type } = req.query;
        let query = { isActive: true };

        if (type) {
            query.type = type;
        }

        const banners = await Banner.find(query).sort({ order: 1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
export const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (banner) {
            res.json(banner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            description,
            buttonText,
            buttonLink,
            discount,
            startDate,
            endDate,
            type,
            order,
        } = req.body;

        // Upload image
        let imageUrl = '';
        if (req.file) {
            const base64 = req.file.buffer.toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${base64}`;

            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'setia-collection/banners',
            });

            imageUrl = uploadResult.secure_url;
        }

        const banner = await Banner.create({
            title,
            subtitle,
            description,
            image: imageUrl,
            buttonText,
            buttonLink,
            discount,
            startDate,
            endDate,
            type,
            order,
        });

        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const {
            title,
            subtitle,
            description,
            buttonText,
            buttonLink,
            discount,
            startDate,
            endDate,
            isActive,
            type,
            order,
        } = req.body;

        // Update image if new one is uploaded
        let imageUrl = banner.image;
        if (req.file) {
            const base64 = req.file.buffer.toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${base64}`;

            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'setia-collection/banners',
            });

            imageUrl = uploadResult.secure_url;
        }

        banner.title = title || banner.title;
        banner.subtitle = subtitle || banner.subtitle;
        banner.description = description || banner.description;
        banner.image = imageUrl;
        banner.buttonText = buttonText || banner.buttonText;
        banner.buttonLink = buttonLink || banner.buttonLink;
        banner.discount = discount !== undefined ? discount : banner.discount;
        banner.startDate = startDate || banner.startDate;
        banner.endDate = endDate || banner.endDate;
        banner.isActive = isActive !== undefined ? isActive : banner.isActive;
        banner.type = type || banner.type;
        banner.order = order !== undefined ? order : banner.order;

        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
