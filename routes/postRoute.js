const express = require('express')
const post = require('../models/post')
const user = require('../models/user')

const router = express.Router()

const { protect } = require('../middleware/auth')

router.get('/',async (req,res)=>
{
    try
    {
        const Posts = await post.find().populate('author','fullname _id');
        res.status(200).json(Posts)
    }
    catch(e)
    {
        res.status(500).json({message:e.message})
    }
})
router.get('/me',protect,async (req,res)=>
{
    const  userId  = req.user._id; 
    try
    {
        const theUser = await user.findById(userId);
        if(!theUser)
        {
            res.status(404).json({ message: "المستخدم لم يعد موجودا" });
            return 
        }

        const Posts = await post.find({author:theUser._id}).populate('author','fullname _id');
        res.status(200).json(Posts)
    }
    catch(e)
    {
        res.status(500).json({message:e.message})
    }
})

router.post('/',protect,async (req,res)=>
{
    if(!req.body.postTitle || !req.body.postBody)
    {
        res.status(400).json({message:"الطلب فارغ"})
        return;
    }
    try
    {
        const Posts = await post.create({...req.body,
        author: req.user._id});
        res.status(201).json(Posts)
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
        const Posts = await post.findById(req.params.id).populate('author','fullname _id')
        if(!Posts)
        {
            res.status(404).json({message: 'المنشور ليس موجود'})
            return;
        }
        res.status(200).json({message:"تم العثور على المنشور بنجاح",post:Posts})
    }
    catch(e)
    {
        res.status(500).json({message:e.message})
    }
})

router.patch('/:id/Like', protect,async (req, res) => {
    try {
        const  userId  = req.user._id; 

        let updatedPost;

        const theUser = await user.findById(userId);
        if(!theUser)
        {
            res.status(404).json({ message: "غير مسجل الدخول" });
            return 
        }
        else
        {

            const thePost = await post.findById(req.params.id)

            if (!thePost) {
                res.status(404).json({ message: "المنشور غير موجود" });
                return 
            }
            if(!thePost.likes.includes(userId))
            {
                updatedPost = await post.findByIdAndUpdate(
                    req.params.id,
                    { $addToSet: { likes: userId } }, 
                    { new: true }
                );
            }
            else
            {
                updatedPost = await post.findByIdAndUpdate(
                    req.params.id,
                    { $pull: { likes: userId }},
                    { new: true }
                );
            }
            res.status(200).json({ message: 'تم تسجيل الإعجاب بنجاح', updatedPost });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.patch('/:id/Dislike', protect,async (req, res) => {
    try {
        const  userId  = req.user._id; 

        let updatedPost;
        
        const thePost = await post.findById(req.params.id)
        const theUser = await user.findById(userId);
        if(!theUser)
        {
            res.status(404).json({ message: "غير مسجل الدخول" });
            return 
        }

        if (!thePost) {
            return res.status(404).json({ message: "المنشور غير موجود" });
        }
        if(!thePost.dislikes.includes(userId))
        {
            updatedPost = await post.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { dislikes: userId } }, 
                { new: true }
            );
        }
        else
        {
            updatedPost = await post.findByIdAndUpdate(
                req.params.id,
                { $pull: { dislikes: userId }},
                { new: true }
            );
        }
        res.status(200).json({ message: 'تم تسجيل عدم الإعجاب بنجاح', updatedPost });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
module.exports = router;