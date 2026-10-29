const user = require('../models/user')
const refreshtoken = require('../models/refreshToken')
const {generateToken, generateRefreshToken, verifyRefreshToken} = require('../utils/jwt');
const crypto = require("crypto")
const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

exports.signUp = async (req,res,next)=>
{
    try
    {
        const newUser = await user.create({
            fullname:req.body.fullname,
            password:req.body.password,
            gender:req.body.gender,
            email:req.body.email,
            role:"user"
        })
        const token = generateToken(newUser._id,newUser.role);
        const RefreshToken = generateRefreshToken(newUser._id)

        await refreshtoken.create({userId:newUser._id,token:hashToken(RefreshToken)})

        res.cookie('RefreshToken',RefreshToken,{
            httpOnly:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
        })
        res.status(201).json({message:'user added successfully', User: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                gender: newUser.gender,
                role: newUser.role
            },token:token})
    }
    catch(e)
    {
        next(e)
    }
}
exports.signIn = async (req,res,next)=>
{
    try
    {
        const User = await user.findOne({
            email:req.body.email,
        }).select('+password')
        if(!User)
        {
            res.status(401).json({message:"البيانات خاطئة"})
            return;
        }
        if(! (await User.comparePassword(req.body.password)))
        {
            res.status(401).json({message:"البيانات خاطئة"})
            return;
        }
        const token = generateToken(User._id,User.role);
        const RefreshToken = generateRefreshToken(User._id)

        await refreshtoken.create({userId:User._id,token:hashToken(RefreshToken)})

        res.cookie('RefreshToken',RefreshToken,{
            httpOnly:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
        });
        res.status(200).json({message:'تم ايجاد المستخدم بنجاح',User: {
                _id: User._id,
                fullname: User.fullname,
                email: User.email,
                gender: User.gender,
                role: User.role
            },token:token})
    }
    catch(e)
    {
        next(e)
    }
}
exports.refreshToken = async (req,res,next)=>{

    const refreshToken  = req.cookies.RefreshToken;

    if(!refreshToken)
    {
        return res.status(401).json({message:'غير مصرح'})
    }
    try
    {
        const decoded = verifyRefreshToken(refreshToken);

        const User = await user.findById(decoded.id);

        if(!User)
        {
            return res.status(404).json({message:'المستخدم لم يعد موجود'})
        }

        const token = generateToken(User._id,User.role)

        const rtoken =  await refreshtoken.findOne({userId:User._id,token:hashToken(refreshToken)})

        if(!rtoken)
        {
            await refreshtoken.deleteMany({userId:User._id});

            return res.clearCookie("RefreshToken",{
            httpOnly:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
        }).json({message:"stolen token detected "})
        }

        const NewRefreshToken = generateRefreshToken(User._id)

        await refreshtoken.findOneAndDelete({token:hashToken(refreshToken)})
        await refreshtoken.create({userId:User._id,token:hashToken(NewRefreshToken)})

        res.clearCookie("RefreshToken");

        res.cookie('RefreshToken',NewRefreshToken,{
            httpOnly:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
        })

        res.status(200).json({token:token})

    }
    catch(e)
    {
        if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        res.clearCookie("RefreshToken", {
            httpOnly:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
        });
        return res.status(401).json({ message: "جلسة الدخول غير صالحة، يرجى تسجيل الدخول مجدداً" });
    }

        next(e);
    }

}
exports.logOut =  async (req, res,next) => {
    const refreshToken  = req.cookies.RefreshToken;

    if(!refreshToken)
    {
        return res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
    }
    try {
        await refreshtoken.findOneAndDelete({token:hashToken(refreshToken)})
        res.clearCookie('RefreshToken',{
            httpOnly:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
        })

        res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
    } catch (e) {
        next(e)
    }
}
