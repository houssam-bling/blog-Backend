const express = require('express')
const rateLimit = require("express-rate-limit")

const {protect, authorize} = require('../middleware/auth');
const { UpdateProfileInf, GetUserProfile, GetAllUsers, DeleteUserByID } = require('../controllers/userController');
const { ProfileShema } = require('../middleware/ShemaValedation');

const router = express.Router();

const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 30, 
    message: { message: 'محاولات كثيرة جداً يرجى المحاولة بعد 15 دقيقة' },
    standardHeaders: true,
    legacyHeaders: false,
});


router.get("/all",userLimiter,protect,authorize("admin"),GetAllUsers)
router.delete("/:UserId",userLimiter,protect,authorize("admin"),DeleteUserByID)
router.patch("/update",userLimiter,protect,ProfileShema,UpdateProfileInf)
router.get("/me",userLimiter,protect,GetUserProfile)

module.exports = router;