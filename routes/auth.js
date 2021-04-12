const express = require('express');
const { signup, signin, signout, forgotPassword, resetPassword, socialLogin, sendOtp, verifyOtp } = require('../controllers/auth');

// import password reset validator
const { userSignupValidator, userSigninValidator, passwordResetValidator } = require('../validator');
const { userById } = require('../controllers/user');

const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSigninValidator, signin);
router.get('/signout', signout);

// password forgot and reset routes
//router.put('/forgot-password', forgotPassword);


// then use this route for social login
router.post('/social-login', socialLogin);

router.post('/forgotPassword', forgotPassword);

//forgot password otp 
router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);
router.put('/reset-password',  resetPassword);

// any route containing :userId, our app will first execute userByID()
router.param('userId', userById);

module.exports = router;
