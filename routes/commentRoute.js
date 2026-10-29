const express = require('express')

const rateLimit = require("express-rate-limit")

const { protect, isCommentOwnerOrAdmin, authorize } = require('../middleware/auth');
const { AddCommetToPost, GetCommentsByPostID, DeleteCommentByID, UpdateCommentbyID, GetAllComments } = require('../controllers/commentController');
const { AddCommentShema } = require('../middleware/ShemaValedation');

const router = express.Router()

const commentLimit = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50, 
    message: { message: 'محاولات كثيرة جداً، يرجى المحاولة بعد 15 دقيقة' },
    standardHeaders: true,
    legacyHeaders: false,
});


router.post('/',commentLimit,protect,AddCommentShema,AddCommetToPost)
router.get('/',protect,authorize("admin"),GetAllComments)
router.get('/:id',commentLimit,GetCommentsByPostID)
router.delete('/:id',commentLimit,protect,isCommentOwnerOrAdmin,DeleteCommentByID)
router.patch('/:id',commentLimit,protect,AddCommentShema,isCommentOwnerOrAdmin,UpdateCommentbyID)

module.exports = router;
