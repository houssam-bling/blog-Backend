const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express()
app.set('trust proxy', 1)


require('dotenv').config();

const mongoose =require("mongoose") 
app.use(cors({
    origin: 'https://blog-frontend-houssam18.vercel.app',
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json());


const postRouter = require('./routes/postRoute');
const authRouter = require('./routes/authRoute');
const commentRouter = require('./routes/commentRoute');
const userRouter = require('./routes/userRoute')

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("connect successfuly")
}).catch(()=>{
    console.log("connect failed")
})


app.use('/posts',postRouter)
app.use('/users',userRouter)
app.use('/auth',authRouter)
app.use('/comments',commentRouter)




 
app.listen(process.env.PORT,()=>{console.log(`i am listen ${process.env.PORT}`)})