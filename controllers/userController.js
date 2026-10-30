const comment = require('../models/comment');
const post = require('../models/post');
const User = require('../models/user');

exports.UpdateProfileInf = async(req,res,next)=>{
    try
    {
        const {fullname,email,gender} = req.body;
        const theUser = await User.findById(req.user._id);

        if(!theUser)
        {
            return res.status(401).json({message:"المستخدم لم يعد موجود"});
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id,{$set:{fullname:fullname,
            email:email,gender:gender
        }},{new:true,runValidators: true}).select('-password');

        res.status(200).json({message:'تم تعديل المعلومات بنجاح',updatedUser})
    }
    catch(e)
    {
        next(e)
    }
}
exports.GetUserProfile = async(req,res,next)=>{
    try
    {
        const theUser = await User.findById(req.user._id);
        if(!theUser)
        {
            return res.status(400).json({message:"المستخدم لم يعد موجود"});
        }
        res.status(200).json({message:'تم جلب المعلومات بنجاح',user:theUser})
    }
    catch(e)
    {
        next(e)
    }
}
exports.GetAllUsers = async(req,res,next)=>{
    try
    {
        const Users = await User.find().sort({createdAt: -1});
        res.status(200).json({message:'تم جلب المعلومات بنجاح',users:Users})
    }
    catch(e)
    {
        next(e)
    }
}
exports.DeleteUserByID = async (req,res,next)=>
{
    const userId = req.params.UserId;
    try
    {
        const deletedUser = await User.findByIdAndDelete(userId)
        if(!deletedUser)
        {
            return res.status(404).json({message:"المستخدم ليس  موجود"});
        }
        await comment.deleteMany({author:userId});
        await post.deleteMany({author:userId});

        res.status(200).json({message:"تم حذف المستخدم بنجاح",deletedUser})
    }
    catch(e)
    {
        next(e)
    }
}
