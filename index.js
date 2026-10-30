
require('dotenv').config();

const mongoose =require("mongoose") 

const app = require("./app")

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("connect successfuly")
}).catch(()=>{
    console.log("connect failed")
})


 
app.listen(process.env.PORT,()=>{console.log(`i am listen ${process.env.PORT}`)})