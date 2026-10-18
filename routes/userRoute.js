const express = require('express')
const {protect} = require('../middleware/auth');
const user = require('../models/user');

const router = express.Router();


router.patch("/update",protect,async(req,res)=>{

    
    try
    {
        const {fullname,email,gender} = req.body;
        const theUser = await user.findById(req.user._id);

        if(!theUser)
        {
            return res.status(401).json({message:"المستخدم غير موجود"});
        }

        const updatedUser = await user.findByIdAndUpdate(req.user._id,{$set:{fullname:fullname,
            email:email,gender:gender
        }},{new:true,runValidators: true}).select('-password');

        res.status(201).json({message:'تم تعديل المعلومات بنجاح',user:updatedUser})
    }
    catch(e)
    {
        res.status(500).json({ message: e.message });
    }

})

module.exports = router;