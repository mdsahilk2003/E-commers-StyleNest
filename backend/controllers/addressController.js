import Address from '../models/Address.js';

// Helper to validate phone and pin code
const validateAddressInputs = ({ phone, zipCode }) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const cleanZip = (zipCode || '').replace(/[^0-9]/g, '');

    if (cleanPhone.length < 10) {
        throw new Error('Please provide a valid 10-digit mobile number');
    }
    if (cleanZip.length < 6) {
        throw new Error('Please provide a valid 6-digit PIN Code');
    }
};

// @desc    Get all addresses for logged in user
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get default address
// @route   GET /api/addresses/default
// @access  Private
export const getDefaultAddress = async (req, res) => {
    try {
        let address = await Address.findOne({ user: req.user._id, isDefault: true });
        if (!address) {
            address = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        }
        res.json(address || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            altPhone,
            houseNo,
            street,
            landmark,
            city,
            state,
            zipCode,
            country,
            type,
            isDefault,
        } = req.body;

        validateAddressInputs({ phone, zipCode });

        // If user has no existing address, auto-set as default
        const existingCount = await Address.countDocuments({ user: req.user._id });
        const shouldBeDefault = existingCount === 0 || Boolean(isDefault);

        if (shouldBeDefault) {
            await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
        }

        const address = await Address.create({
            user: req.user._id,
            fullName,
            phone,
            altPhone: altPhone || '',
            houseNo,
            street,
            landmark: landmark || '',
            city,
            state,
            zipCode,
            country: country || 'India',
            type: type || 'Home',
            isDefault: shouldBeDefault,
        });

        res.status(201).json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const {
            fullName,
            phone,
            altPhone,
            houseNo,
            street,
            landmark,
            city,
            state,
            zipCode,
            country,
            type,
            isDefault,
        } = req.body;

        if (phone || zipCode) {
            validateAddressInputs({
                phone: phone || address.phone,
                zipCode: zipCode || address.zipCode,
            });
        }

        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
            address.isDefault = true;
        }

        address.fullName = fullName || address.fullName;
        address.phone = phone || address.phone;
        address.altPhone = altPhone !== undefined ? altPhone : address.altPhone;
        address.houseNo = houseNo || address.houseNo;
        address.street = street || address.street;
        address.landmark = landmark !== undefined ? landmark : address.landmark;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.country = country || address.country;
        address.type = type || address.type;

        const updatedAddress = await address.save();
        res.json(updatedAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const wasDefault = address.isDefault;
        await address.deleteOne();

        // If default address was deleted, mark the latest address as default
        if (wasDefault) {
            const nextDefault = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
            if (nextDefault) {
                nextDefault.isDefault = true;
                await nextDefault.save();
            }
        }

        res.json({ message: 'Address removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set address as default
// @route   PATCH /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
        address.isDefault = true;
        await address.save();

        res.json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
