const express = require('express');
const { userLogin, userRegistration, resetPassword, forgotPassword} = require('../controllers/AuthenticationController');
const router = express.Router();

//Routes mainly responsible for User Authentication
router.post('/login', userLogin);
router.post('/register', userRegistration);
router.put('/resetpassword', resetPassword);
router.post('/forgotpassword', forgotPassword);


module.exports = router;