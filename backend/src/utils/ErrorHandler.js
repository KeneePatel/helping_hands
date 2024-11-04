const ErrorMessage = require('./ErrorMessage');

const handler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error Occured';
    const details = error.details || null;
    res.status(statusCode).json({
        success: false,
        message,
        details
    });
};

module.exports = handler;
