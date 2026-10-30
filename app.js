const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express()

const rateLimit = require("express-rate-limit")

app.set('trust proxy', 1)


require('dotenv').config();

const globalLimiter = rateLimit({
    limit:250,
    windowMs:1000 * 60 * 15,
    message: { message: 'طلبات كثيرة جدا يرجى المحاولة بعد 15 دقيقة' },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(cors({
    origin: (origin,callback)=>{

        if('https://blog-frontend-houssam18.vercel.app' === origin || 'http://localhost:5173' === origin ||!origin)
        {
           return callback(null,true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json({limit:"10kb"}));
app.use(globalLimiter)


const postRouter = require('./routes/postRoute');
const authRouter = require('./routes/authRoute');
const commentRouter = require('./routes/commentRoute');
const userRouter = require('./routes/userRoute');
const stateRouter = require('./routes/stateRoute');
const { GlobalErrorHandler } = require("./middleware/Global Error Handler");

app.use('/posts',postRouter)
app.use('/users',userRouter)
app.use('/auth',authRouter)
app.use('/state',stateRouter)
app.use('/comments',commentRouter)

app.use(GlobalErrorHandler);


 module.exports = app;