const express = require('express');
const { sendOtp, verifyOtp, testLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/test-login', testLogin);

module.exports = router;
