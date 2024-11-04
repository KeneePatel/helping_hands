const Item = require('../models/Item');
const Constants = require('../utils/Constants');

exports.createItem = async (request, response) => {
    const { title, description, type, userId, address, images, status = 1 } = request.body; // Default status to 1 if not provided

    try {
        // Create a new item based on the schema
        const newItem = new Item({
            title,
            userId,
            description,
            type,
            address: {
                street: address?.street || '',
                city: address?.city || '',
                province: address?.province || '',
                country: address?.country || ''
            },
            images,
            status
        });

        await newItem.save();

        response.status(Constants.STATUSCREATED).json({ message: 'Item created successfully', itemId: newItem._id });
    } catch (error) {
        console.log(error.message);
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};

exports.updateItemById = async (request, response) => {
    const { title, description, type, address, images, status } = request.body;
    const itemId = request.params.id; // itemId is expected to be the MongoDB _id

    try {
        // Find item by _id and ensure it exists
        const item = await Item.findById(itemId);
        if (!item) {
            return response.status(Constants.NOTFOUND).json({ message: 'Item not found' });
        }

        // Update fields if they are provided, else keep existing values
        item.title = title || item.title;
        item.description = description || item.description;
        item.type = type || item.type;
        item.images = images || item.images;
        item.status = status !== undefined ? status : item.status;  // Only update if status is provided

        if (address) {
            item.address.street = address.street || item.address.street;
            item.address.city = address.city || item.address.city;
            item.address.province = address.province || item.address.province;
            item.address.country = address.country || item.address.country;
        }

        await item.save();

        response.json({ message: 'Item updated successfully', itemId });
    } catch (error) {
        console.log(error.message);
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};


exports.deleteItemById = async (request, response) => {
    const itemId = request.params.id; // itemId is expected to be the MongoDB _id

    try {
        // Find and delete the item by _id
        const item = await Item.findByIdAndDelete(itemId);
        if (!item) {
            return response.status(Constants.NOTFOUND).json({ message: 'Item not found' });
        }

        response.json({ message: 'Item deleted successfully', itemId });
    } catch (error) {
        console.log(error.message);
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};

exports.getItemById = async (request, response) => {
    const itemId = request.params.id; // itemId is expected to be the MongoDB _id

    try {
        // Find the item by _id and ensure it exists
        const item = await Item.findById(itemId);
        if (!item) {
            return response.status(Constants.NOTFOUND).json({ message: 'Item not found' });
        }

        // Check if the item is active (status = 1)
        if (item.status !== 1) {
            return response.status(Constants.FORBIDDEN).json({ message: 'Item is not active' });
        }

        response.json({ item });
    } catch (error) {
        console.log(error.message);
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};


exports.getItems = async (request, response) => {
    const { status, type, userId } = request.query; // Get type from query parameters

    try {
        const filter = { }; // Ensure only active items are retrieved
        if (status) {
            filter.status = status; // Add status filter if provided
        }
        
        if (type) {
            filter.type = type; // Add type filter if provided
        }
        if(userId) {
            filter.userId = userId;
        }
        console.log("filter", filter);
        const items = await Item.find(filter).sort({ createdAt: -1 });
        console.log("items", items);
        response.json({ items });
    } catch (error) {
        console.log(error.message);
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};