const Constants = require('../utils/Constants');

exports.userAuthorization = (request, respond, next) => {
    if (request.user.id !== request.params.id) {
        return respond.status(Constants.USERNOTPERMITTED).json({ message: 'Operation is not authorized by User' });
    }
    next();
};