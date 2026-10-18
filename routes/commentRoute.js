const express = require('express')
const comment = require('../models/comment');
const { protect } = require('../middleware/auth');
const user = require('../models/user');

const router = express.Router()

router.post('/',protect,async (req,res)=>
{
    
    try
    {
        const theuser = await user.findById(req.user._id)
        if(!theuser)
        {
            res.status(404).json({message:"لم نجد المستخدم"})
        }
        const Comment = await comment.create({...req.body,author:theuser.id})
        
        res.status(201).json({message:"تم نشر التعليق بنجاح",Comment})
    }
    catch(e)
    {
        res.status(500).json({message:e.message})
    }
})
router.get('/:id',async (req,res)=>
{
    try
    {
        const Comment = await comment.find({postId:req.params.id}).populate('author','fullname _id')
        
        res.status(200).json({message:"تم جلب التعليقات بنجاح",Comment})
    }
    catch(e)
    {
        res.status(500).json({message:e.message})
    }
})

module.exports = router;
