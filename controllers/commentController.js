const comment = require('../models/comment');
const user = require('../models/user');
const post = require('../models/post');

exports.AddCommetToPost = async (req,res,next)=>
{
    try
    {
        const Post = await post.findById(req.body.postId);
        if(!Post)
        {
            return res.status(404).json({message:"لم نجد المنشور"})
        }
        const Comment = await comment.create({postId:Post._id,commentText:req.body.commentText,author:req.user._id})

        
        res.status(201).json({message:"تم نشر التعليق بنجاح",Comment})
    }
    catch(e)
    {
        next(e);
    }
}

exports.GetCommentsByPostID = async (req,res,next)=>
{
    try
    {
        const Comment = await comment.find({postId:req.params.id}).populate('author','fullname _id')
        res.status(200).json({message:"تم جلب التعليقات بنجاح",Comment})
    }
    catch(e)
    {
        next(e);    
    }
}
exports.DeleteCommentByID = async (req,res,next)=>
{
    try
    {
        const Comment = await comment.findByIdAndDelete(req.params.id)
        if(!Comment)
        {
           return res.status(404).json({message:"لايوجد تعليق بهاذا المعرف"})
        }
        res.status(200).json({message:"تم حذف التعليق بنجاح",Comment:Comment})
    }
    catch(e)
    {
       next(e);
    }
}
exports.UpdateCommentbyID = async (req,res,next)=>
{
    const newCommentText = req.body.commentText;
    if(!newCommentText)
    {
        return res.status(404).json({message:"االرجاء ادخال الجقول المطلوبة"})
    }
    try
    {
        const newComment = await comment.findByIdAndUpdate(req.params.id,{$set:{commentText:newCommentText}},{new:true});
        if(!newComment)
        {
            return res.status(404).json({message:"لايوجد تعليق بهاذا المعرف"})
        }
        res.status(200).json({message:"تم تعديل التعليق بنجاح",Comment:newComment})
    }
    catch(e)
    {
        next(e);
    }
}
exports.GetAllComments = async(req,res,next)=>
{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const totalcomments = await comment.countDocuments();
    const skip = (page - 1) * limit
    try
    {
        const Comments = await comment.find().populate('author','fullname _id')
        .populate('postId', 'postTitle') .sort({createdAt: -1}).limit(limit).skip(skip)
        res.status(200).json({Comments,TotalPages:Math.ceil(totalcomments / limit ),CurrentPage:page})
    }
    catch(e)
    {
        next(e)
    }
}
