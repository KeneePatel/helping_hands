const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const Constants = require('../utils/Constants');
const req = require("express/lib/request");

exports.authenticate = async (request, response, next) => {
    let JWT;

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        JWT = request.headers.authorization.split(' ')[1];
    }

    if (!JWT) {
        return response.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, message: Constants.NOTAUTHENTICATEMSG });
    }

    try {
        const decodedUser = jwt.verify(JWT, process.env.JWT_SECRET);
        const user  = await Profile.findById(decodedUser.id).select(Constants.REMOVEUSERCOLUMNPASSWORD);
        request.user = user;
        next();
    } catch (error) {
        response.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, message: Constants.NOTAUTHENTICATEMSG });
    }
};