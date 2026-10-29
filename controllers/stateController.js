const comment = require("../models/comment");
const post = require("../models/post");
const user = require("../models/user");
const mongoose =require("mongoose") 


exports.GetAdminStates = async(req,res,next)=>
{
    try
    {
        const [posts, users, comments] = await Promise.all([
            post.estimatedDocumentCount(), 
            user.estimatedDocumentCount(), 
            comment.estimatedDocumentCount()
        ]);    
        res.status(200).json({
        message: "تم جلب الاحصائيات بنجاح",
        postCount: posts,
        userCount: users,
        commentCount: comments,
        });
    }
    catch(e)
    {
        next(e);
    }
}
exports.GetProfileStates = async(req,res,next)=>
{
    try
    {
        const [posts, likes, comments] = await Promise.all([
            post.countDocuments({author:req.user._id}), 
            post.countDocuments({likes:req.user._id}), 
            comment.countDocuments({author:req.user._id})
        ]);    
        res.status(200).json({
        message: "تم جلب الاحصائيات بنجاح",
        postCount: posts,
        likeCount: likes,
        commentCount: comments,
        });
    }
    catch(e)
    {
        next(e);
    }
}