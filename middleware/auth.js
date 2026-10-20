const {verifyToken} = require('../jwt');
const post = require('../models/post');
const user = require('../models/user');

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

        const decoded = verifyToken(token)

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
   return (req,res,next)=>{

        if(!roles.includes(req.user.role))
        {
            return res.status(403).json({ 
                message: 'غير مصرح لك بهذا الإجراء' 
            });
        }
        next();
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