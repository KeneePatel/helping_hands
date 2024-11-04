require('dotenv').config();
const mongoose = require('mongoose');

const DatabaseConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connection established successfully`);
    } catch (e) {
        console.error(`Database Connection Error: ${e.message}`);
    }
};

module.exports = DatabaseConnection;