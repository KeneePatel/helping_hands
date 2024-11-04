const Profile = require('../models/Profile');
const Constants = require('../utils/Constants');
const bcrypt = require('bcryptjs');
const {response} = require("express");

//Update the user profile record by userId
exports.updateUserProfileById = async (request, response) => {
    const { firstName,lastName, gymName, password, phone, address } = request.body;

    try {
        let userId = request.params.id;

        let userProfileRecord = await Profile.findById(userId);
        if (!userProfileRecord) {
            return response.status(Constants.NOTFOUND).json({ message: 'User Profile not found' });
        }

        userProfileRecord.firstName = firstName || userProfileRecord.firstName;
        userProfileRecord.lastName = lastName || userProfileRecord.lastName;
        userProfileRecord.gymName = gymName || userProfileRecord.gymName;
        userProfileRecord.phone = phone || userProfileRecord.phone;
        userProfileRecord.address = address || userProfileRecord.address;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            userProfileRecord.password = await bcrypt.hash(password, salt);
        }

        await userProfileRecord.save();

        response.json({ message: 'User Profile updated successfully',userId});
    } catch (error) {
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};

//Get the user profile record by userId
exports.getUserProfileById = async (request, response) => {
    try {
        const userProfileRecord = await Profile.findById(request.params.id).select(Constants.REMOVEUSERCOLUMNPASSWORD);
        if (!userProfileRecord) {
            return response.status(Constants.NOTFOUND).json({ message: 'User Profile not found' });
        }
        response.json(userProfileRecord);
    } catch (error) {
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};

//Delete the user profile record by userId
exports.deleteUserProfileById = async (request, response) => {
    try {
        let userId = request.params.id;

        const userProfileRecord = await Profile.findById(userId);
        if (!userProfileRecord) {
            return response.status(Constants.NOTFOUND).json({ message: 'User Profile not found' });
        }

        await Profile.findByIdAndDelete(userId);

        response.json({ message: 'User Profile deleted successfully' });
    } catch (error) {
        response.status(Constants.INTERNALERRORSTATUS).send('Server error');
    }
};