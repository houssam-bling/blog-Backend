const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commentText:
    {
        type:String,
        required: true
    },
    author: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    postId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
},{ timestamps: true })

module.exports = mongoose.model('Comment', commentSchema);