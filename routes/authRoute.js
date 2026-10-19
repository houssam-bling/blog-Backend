const express = require('express')
const user = require('../models/user')
const {generateToken, generateRefreshToken, verifyRefreshToken} = require('../jwt')


const router = express.Router()


router.post('/SignUp',async (req,res)=>
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

        res.cookie('RefreshToken',RefreshToken,{
            httpOnly:true,
            sameSite:'Non',
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
        res.status(500).json({message:e.message})
    }
})
router.post('/SignIn',async (req,res)=>
{
    try
    {
        const User = await user.findOne({
            email:req.body.email,
        }).select('+password')
        if(!User)
        {
            res.status(404).json({message:"البريد الالكتروني غير موجود"})
            return;
        }
        if(! (await User.comparePassword(req.body.password)))
        {
            res.status(400).json({message:"كلمة المرور خاطئة"})
            return;
        }
        const token = generateToken(User._id,User.role);
        const RefreshToken = generateRefreshToken(User._id)

        res.cookie('RefreshToken',RefreshToken,{
            httpOnly:true,
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure:true,
        })


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
        res.status(500).json({message:e.message})
    }
})

router.get('/refresh', async (req,res)=>{

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

        res.status(200).json({Token:token})

    }
    catch(e)
    {
        res.status(401).json({message:'Refresh Token غير صالح'})
    }

})



module.exports = router;
