const Profile = require('../models/Profile');
const authService = require('../services/authService');
const crypto = require("crypto");
const Constants = require('../utils/Constants');
const CustomError = require('../utils/ErrorMessage');

//Async method which handles user registration
exports.userRegistration = async (request, response, next) => {
    const { email, firstName, lastName, gymName, password, type } = request.body;
    try {
        const existingProfile = await Profile.findOne({ email: email });
        if (existingProfile) {
            return response.status(Constants.STATUSNOTFOUND).send({ error: Constants.EMAILEXISTS });
        }
        else{
            const hashedPassword = await authService.getHashedPassword(password);
            const user = await Profile.create({ email, firstName, lastName, gymName, password: hashedPassword, type });
            const JWT = authService.generateJWTToken(user);
            response.status(Constants.STATUSCREATED).json({ success: true, JWT });
        }
    } catch (error) {
        console.log(error.message);
        next(new CustomError(Constants.REGISTRATIONFAILED, error.message, 500));
    }
};

//Async method which handles user login using JWT
exports.userLogin = async (request, response, next) => {
    const { email, password } = request.body;
    try {
        const user = await Profile.findOne({ email });
        if(!user){
            return response.status(Constants.STATUSNOTFOUND).json({ success: false, error: Constants.EMAILNOTEXISTS });
        }
        else{
            const match = await authService.matchPassword(password,user.password);
            if(!match){
                return response.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, error: Constants.INVALIDPASSWORD });
            }
        }
        response.status(Constants.STATUSOK).json({ success: true, token: authService.generateJWTToken(user) });
    } catch (error) {
        console.log(error.message);
        next(new CustomError(Constants.LOGINFAILED, error.message, 500));
    }
};

//Reset Password method that is used to set new password by using the reset token send on user's email address.
exports.resetPassword = async (request, response) => {
    const resetPasswordToken = crypto.createHash(Constants.HASHALGO).update(request.body.passwordResetToken).digest(Constants.HASHENCODING);
    try {
        const user = await Profile.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return response.status(Constants.STATUSNOTAUTHORIZED).json({ success: false, error: Constants.INVALIDJWTTOKEN });
        }

        user.password = await authService.getHashedPassword(request.body.password);
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        response.status(Constants.STATUSOK).json({ success: true, token: authService.generateJWTToken(user._id) });
    } catch (error) {
        response.status(Constants.INTERNALERRORSTATUS).json({ success: false, error: error.message });
    }
};

//Forgot Password method mainly generates reset token and sent it through the email to user's email address.
exports.forgotPassword = async (request, response) => {
    const { email } = request.body;
    try {
        const user = await Profile.findOne({ email });
        if (!user) {
            return response.status(Constants.STATUSNOTFOUND).json({ success: false, error: Constants.EMAILNOTEXISTS });
        }

        const resetToken = crypto.randomBytes(Constants.CRYPTOBYES).toString(Constants.HASHENCODING);
        console.log("reset");

        user.resetPasswordToken = crypto.createHash(Constants.HASHALGO).update(resetToken).digest(Constants.HASHENCODING);
        user.resetPasswordExpire = Date.now() + Constants.MILLISECONDS * Constants.SECONDS * Constants.MINUTES; // token valid for only 20 minutes
        console.log("before");

        await user.save();
        console.log("after");

        const resetUrl = `${resetToken}`;

        const message = Constants.EMAILBODY + "Password Reset Token : "+`${resetUrl}`;
        await authService.sendEmail({ email: user.email, subject: Constants.EMAILSUBJECT, message });

        response.status(Constants.STATUSOK).json({ success: true, message: Constants.RESETEMAILSENT });
    } catch (error) {
        console.log("error: ", error);
        const user = await Profile.findOne({ email });
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        response.status(Constants.INTERNALERRORSTATUS).json({ success: false, error: Constants.RESETEMAILERROR });
    }
};

