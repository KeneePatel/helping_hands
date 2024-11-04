const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const JWTSecret = process.env.JWT_SECRET;

if (!JWTSecret) {
    throw new Error('JWT secret is not defined');
}

//method use to generate JWT for user authentication, it will be valid only for 8h then user must authenticate again.
function generateJWTToken(user) {
    const JWTSecret = process.env.JWT_SECRET;
    if (!JWTSecret) {
        throw new Error('JWT token secret is not defined');
    }

    const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName || 'F',
        lastName: user.lastName || 'L',
        gymName: user.gymName || 'GM',
        type: user.type
    };
    return  jwt.sign(payload, JWTSecret, { expiresIn: '8h' });
}

//method use to convert password string into hashed form for security purpose
async function getHashedPassword(password) {
    return await bcrypt.hash(password, 10);
}

//method use to compare the entered password and encrypted password stored in db.
async function matchPassword(password,enteredPassword){
    return await bcrypt.compare(password, enteredPassword);
}

//Nodemail method to send email for password reset link
const sendEmail = async (nodeMailConfig) => {
    const mailTransporter = nodemailer.createTransport({
        auth: {
            user: process.env.NODEMAIL_USERNAME,
            pass: process.env.NODEMAIL_PASSWORD
        },
        service: process.env.NODEMAIL_SERVICE
    });
    const message = {
        from: `${process.env.FROM_USERNAME} <${process.env.FROM_EMAILADDRESS}>`,
        to: nodeMailConfig.email,
        subject: nodeMailConfig.subject,
        text: nodeMailConfig.message
    };
    await mailTransporter.sendMail(message);
};


module.exports = {
    generateJWTToken,
    matchPassword,
    getHashedPassword,
    sendEmail
};