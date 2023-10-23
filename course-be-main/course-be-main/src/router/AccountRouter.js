const express = require('express');
const router = express.Router();
const AccountController = require('../controller/AccountController');
const StudentController = require('../controller/StudentController');
const adminRole = require('../middleware/AdminRole');



router.post('/register', AccountController.postRegister);
router.post('/login', AccountController.postLogin);
router.post('/update-information', AccountController.postUpdateInformation);
router.post('/forgot-password', AccountController.postForgotPassword);
router.post('/check-otp', AccountController.postCheckOTP);
router.post('/reset-password', AccountController.postResetPassword);


router.get('/logout', AccountController.getLogout);
router.get('/get-profile', AccountController.getProfile);



module.exports = router;