const express = require('express')
const rateLimit = require("express-rate-limit")

const router = express.Router()

const { protect, isOwnerOrAdmin } = require('../middleware/auth');
const { AddPostShema } = require('../middleware/ShemaValedation');
const { getAllPosts, getMyPosts, addPost, getPostById, addLikeToPost, addDislikeToPost, deletePostByID, editePostById } = require('../controllers/postController');


const addLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: { message: 'محاولات كثيرة جداً لتسجيل الدخول، يرجى المحاولة بعد 15 دقيقة' },
    standardHeaders: true,
    legacyHeaders: false,
});
const LikeDislikeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 40, 
    message: { message: 'محاولات كثيرة جداً لتسجيل الدخول، يرجى المحاولة بعد 15 دقيقة' },
    standardHeaders: true,
    legacyHeaders: false,
});
const GetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: { message: 'محاولات كثيرة جداً لتسجيل الدخول، يرجى المحاولة بعد 15 دقيقة' },
    standardHeaders: true,
    legacyHeaders: false,
});


router.get('/',GetLimiter,getAllPosts)
router.get('/me',GetLimiter,protect,getMyPosts)
router.post('/',addLimiter,protect,AddPostShema,addPost)
router.get('/:id',GetLimiter,getPostById)
router.patch('/:id/Like',LikeDislikeLimiter, protect,addLikeToPost);
router.patch('/:id/Dislike',LikeDislikeLimiter ,protect,addDislikeToPost);
router.delete('/:id',addLimiter,protect,isOwnerOrAdmin,deletePostByID)
router.patch('/:id',addLimiter,protect,isOwnerOrAdmin,editePostById);

module.exports = router;