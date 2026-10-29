const express = require('express')

const rateLimit = require("express-rate-limit")
const {SignUpFn,SignInFn} = require("../middleware/ShemaValedation");
const { signUp, signIn, refreshToken, logOut } = require('../controllers/authController');

const router = express.Router()


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: { message: 'محاولات كثيرة جداً لتسجيل الدخول، يرجى المحاولة بعد 15 دقيقة' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/SignUp',SignUpFn,authLimiter,signUp)

router.post('/LogOut',logOut);

router.post('/SignIn',SignInFn,authLimiter,signIn)

router.get('/refresh', refreshToken)



module.exports = router;
