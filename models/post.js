const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new Schema({
    postTitle:
    {
        type:String,
        required: true
    },
    postBody:    
    {
        type:String,
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    author: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
},{ timestamps: true })

module.exports = mongoose.model('Post', postSchema);