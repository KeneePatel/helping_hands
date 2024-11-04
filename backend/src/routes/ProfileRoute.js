const express = require('express');
const {updateUserProfileById,getUserProfileById,deleteUserProfileById} = require('../controllers/ProfileController');
const router = express.Router();
const {authenticate} = require('../middlewares/Authenticate');
const {userAuthorization} = require('../middlewares/Authorization');

//Routes for user profile record
router.get('/:id',authenticate, getUserProfileById);
router.put('/:id',authenticate,userAuthorization, updateUserProfileById);
router.delete('/:id',authenticate,userAuthorization, deleteUserProfileById);


module.exports = router;