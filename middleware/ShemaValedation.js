const z = require('zod')


const SignInShema = z.object({
    email:z.email(),
    password:z.string().min(1,'ادخل باسوورد')
})
const SignUpShema = z.object({
    fullname:z.string().min(3),
    email:z.email('بريد إلكتروني غير صالح'),
    password:z.string().min(1,'ادخل باسوورد'),
    gender:z.enum(["male","female"],{message:"الجنس يجب أن يكون male أو female"})
})
const ProfileShema = z.object({
    fullname:z.string().min(3),
    email:z.email('بريد إلكتروني غير صالح'),
    gender:z.enum(["male","female"],{message:"الجنس يجب أن يكون male أو female"})
})
const PostShema = z.object({
    postTitle:z.string().min(10).max(150,'العنوان طوبل جدا'),
    postBody:z.string().min(20,"المنشور قصير جدا").max(200,'لمنشور طوبل جدا'),
})
const CommentShema = z.object({
    commentText:z.string().min(10).max(100,'التعليق طوبل جدا'),
})

exports.ProfileShema = (req,res,next)=>{
    try
    {
        ProfileShema.parse({email:req.body.email,fullname:req.body.fullname,gender:req.body.gender});
        next();

    }
    catch(e)
    {
       return next(e)
    }
}
exports.SignInFn = (req,res,next)=>{
    try
    {
        SignInShema.parse({email:req.body.email,password:req.body.password});
        next();

    }
    catch(e)
    {
       return next(e)
    }
}
exports.SignUpFn = (req,res,next)=>{
    try
    {
        SignUpShema.parse({email:req.body.email,password:req.body.password,fullname:req.body.fullname,gender:req.body.gender});
        next();

    }
    catch(e)
    {
        return next(e)
    }
}

exports.AddPostShema = (req,res,next)=>{
    try
    {
        PostShema.parse({postTitle:req.body.postTitle,postBody:req.body.postBody});
        next();

    }
    catch(e)
    {
        return next(e)
    }

}
exports.AddCommentShema = (req,res,next)=>{
    try
    {
        CommentShema.parse({commentText:req.body.commentText});
        next();
    }
    catch(e)
    {
        return next(e)
    }

}

