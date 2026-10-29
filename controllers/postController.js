const post = require('../models/post')
const user = require('../models/user')
const comment = require('../models/comment');


exports.getAllPosts = async (req,res,next)=>
{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const totalPosts = await post.countDocuments();
    const skip = (page - 1) * limit
    try
    {
        const Posts = await post.find().populate('author','fullname _id').sort({createdAt: -1}).limit(limit).skip(skip)
        res.status(200).json({Posts,TotalPages:Math.ceil(totalPosts / limit ),CurrentPage:page})
    }
    catch(e)
    {
        next(e)
    }
}
exports.getMyPosts = async (req,res,next)=>
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
        res.status(200).json({message:'تم جلب المنشورات بنجاح',Posts:Posts})
    }
    catch(e)
    {
        next(e)
    }
}
exports.addPost = async (req,res,next)=>
{

    if(!req.body.postTitle || !req.body.postBody)
    {
        res.status(400).json({message:"الطلب فارغ"})
        return;
    }
    const body = {postTitle:req.body.postTitle,postBody:req.body.postBody}
    try
    {
        const Posts = await post.create({...body,
        author: req.user._id});
        res.status(201).json(Posts)
    }
    catch(e)
    {
        next(e)
    }
}
exports.getPostById = async (req,res,next)=>
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
        next(e)
    }
}
exports.addLikeToPost = async (req, res,next) => {
    try 
    {
        const  userId  = req.user._id; 

        let updatedPost;


        const thePost = await post.findById(req.params.id)

        if (!thePost) {
            res.status(404).json({ message: "المنشور غير موجود" });
            return 
        }
        if(!thePost.likes.includes(userId))
        {
            if(thePost.dislikes.includes(userId))
            {
                updatedPost = await post.findByIdAndUpdate(
                    req.params.id,
                    { $addToSet: { likes: userId },$pull:{dislikes : userId} }, 
                    { new: true }
                );
            }
            else
            {
                updatedPost = await post.findByIdAndUpdate(
                    req.params.id,
                    { $addToSet: { likes: userId } }, 
                    { new: true }
                );

            }
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
    catch (e) {
        next(e)
    }
}
exports.addDislikeToPost = async (req, res,next) => {
    try {
        const  userId  = req.user._id; 

        let updatedPost;
        
        const thePost = await post.findById(req.params.id)

        if (!thePost) {
            return res.status(404).json({ message: "المنشور غير موجود" });
        }
        if(!thePost.dislikes.includes(userId))
        {

            if(thePost.likes.includes(userId))
            {
                updatedPost = await post.findByIdAndUpdate(
                    req.params.id,
                    { $addToSet: { dislikes: userId },$pull:{likes : userId} }, 
                    { new: true }
                );
            }
            else
            {
                updatedPost = await post.findByIdAndUpdate(
                    req.params.id,
                    { $addToSet: { dislikes: userId } }, 
                    { new: true }
                );
            }
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
        next(e)
    }
}
exports.deletePostByID = async (req,res,next)=>{
    try {
        await comment.deleteMany({postId:req.params.id})
        await post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "تم حذف المنشور بنجاح" });
    } catch (e) {
        next(e)
    }
}
exports.editePostById = async (req, res,next) => {

    if(!req.body.postTitle || !req.body.postBody )
    {
        res.status(400).json({ message: "كل الحقول مطلوبة" });
        return 
    }

    try {
        let updatedPost;        

        updatedPost = await post.findByIdAndUpdate(
            req.params.id,
            { $set: { postTitle:req.body.postTitle,
                postBody:req.body.postBody
             }},
            { new: true }
        );
        
        res.status(200).json({ message: 'تم تعديل المنشور بنجاح', updatedPost });
    } catch (e) {
        next(e);
    }
}