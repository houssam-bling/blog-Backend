const {verifyToken} = require('../utils/jwt');
const post = require('../models/post');
const user = require('../models/user');
const comment = require('../models/comment');

exports.protect = async (req,res,next)=>{

    try
    {
        let token;

        if(req.headers.authorization?.startsWith('Bearer'))
        {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token)
        {
            return res.status(401).json({ 
                    message: 'غير مصرح، الرجاء تسجيل الدخول' 
                })
        }

        const decoded = verifyToken(token);

        const theUser = await user.findById(decoded.id);
        if (!theUser) {
            return res.status(401).json({ 
                message: 'المستخدم لم يعد موجوداً' 
            });
        }

        req.user = {
                _id: theUser._id,
                fullname: theUser.fullname,
                email: theUser.email,
                role: theUser.role
        };

        next()

    }
    catch(err)
    {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'token غير صالح' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'token منتهي الصلاحية' });
        }
        res.status(500).json({ message: err.message });
    }
}
exports.authorize = (...roles)=>{
    return async (req,res,next)=>{

        if(roles.includes(req.user.role))
        {
            return next();
        }
        return res.status(403).json({message:"لست مصرح"})
    }
}
exports.isOwnerOrAdmin = async (req,res,next)=>{

    try
    {
       const Post = await post.findById(req.params.id)
       if(!Post)
       {
            return res.status(404).json({message:"المنشور غير موجود"})
       }

       if(req.user.role === "admin")
       {
            return  next();
       }

       if(req.user._id.toString() !== Post.author.toString())
       {
            return res.status(401).json({message:"غير مصرح"})
       }
       next()
    }
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
}
exports.isCommentOwnerOrAdmin = async (req, res, next) => {
    try {
        const Comment = await comment.findById(req.params.id); 

        if (!Comment) {
            return res.status(404).json({ message: "التعليق غير موجود" });
        }

        if (req.user.role === "admin" || req.user._id.toString() === Comment.author.toString()) {
            return next();
        }

        res.status(401).json({ message: "غير مصرح لك بحذف هذا التعليق" });
    } catch (err) {
        next(err);
    }
};