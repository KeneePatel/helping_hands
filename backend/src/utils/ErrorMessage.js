//Custom Error Message class
class ErrorMessage extends Error {
    constructor(errorMsg, details, statusCode) {
        super(errorMsg);
        this.details = details;
        this.statusCode = statusCode;
    }
}

module.exports = ErrorMessage;