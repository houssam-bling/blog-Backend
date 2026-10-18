const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    fullname:
    {
        type:String,
        required: true
    },
    email:    
    {
        type:String,
        required: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String, 
        required: true,
        select: false,
        minlength: 6,
    },
    gender:
    {
        type: String, 
        required: true,
        enum: ['male', 'female']
    },
    role:
    {
        type: String, 
        required: true,
        default: "user",
        enum: ['user', 'admin']
    }
},{ timestamps: true })

userSchema.pre("save",async function() {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password,12)
})

userSchema.methods.comparePassword = async function(candidatePassword)
{
    return await bcrypt.compare(candidatePassword,this.password)
}

module.exports = mongoose.model('User', userSchema);