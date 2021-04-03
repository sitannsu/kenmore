const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    // photo: {
    //     data: Buffer,
    //     contenType: String
    // },
    
    photo:[],
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,

    likes: [ { userId:String ,count: Number, likedBy: { type: ObjectId, ref: 'User' }  } ],

    comments: [
        {
            text: String,
            parentCommentId: { 
            type:String ,
            default:""
            
            },
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: 'User' },
            comments: [
                {
                    text: String,
                    
                    created: { type: Date, default: Date.now },
                    postedBy: { type: ObjectId, ref: 'User' },
            
                    likes: [ { userId:String , count: Number  }]
                }
            ],
    
            likes: [ { userId:String , count: Number  }]
        }
    ]
    
    
});

module.exports = mongoose.model('Post', postSchema);
