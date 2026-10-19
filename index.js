const express = require("express")
const cookieParser = require('cookie-parser')
const app = express()


require('dotenv').config();

const mongoose =require("mongoose") 
app.use(cors({
    origin: 'https://blog-frontend-32lx0t3u1-houssam18.vercel.app',
    credentials: true 
}));
app.use(cors());
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