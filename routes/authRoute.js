const express = require('express')
const user = require('../models/user')
const {generateToken} = require('../jwt')


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



module.exports = router;
