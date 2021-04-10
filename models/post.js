var mongoose     = require('mongoose')
  , mongoosastic = require('mongoosastic')
  , Schema       = mongoose.Schema
const { ObjectId } = mongoose.Schema;
var textSearch = require('mongoose-partial-full-search');



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
//postSchema.plugin(textSearch);
//postSchema.index({'$**': 'text'});
postSchema.plugin(mongoosastic)
module.exports = mongoose.model('Post', postSchema);
