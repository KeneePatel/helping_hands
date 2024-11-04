const mongoose = require('mongoose');

// Item Schema with createdAt, updatedAt, and status fields
const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        province: { type: String, required: false },
        country: { type: String, required: false },
    },
    images: {
        type: [String],
        required: false,
    },
    status: {
        type: Number,
        required: true,
        default: 1  // Set a default value for status, e.g., 1 for active, 0 for inactive
    }
}, { timestamps: true }); // Enable timestamps

module.exports = mongoose.model('Item', ItemSchema);
