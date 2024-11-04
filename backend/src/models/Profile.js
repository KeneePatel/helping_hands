const mongoose = require('mongoose');

//User Schema file that is used to store and retrieve data from mongodb cloud
const UserProfileSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        province: { type: String, required: false },
        country: {type: String, required: false },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

module.exports = mongoose.model('Profile', UserProfileSchema);
