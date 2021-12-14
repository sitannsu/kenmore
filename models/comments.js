const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
   
    comments: {
        type: String,
        trim: true,
        required: true
    },
    commentsByName: {
        type: String,
       
    },

    commentBy: {
        type: Object,
        ref: "SchoolUser"
    },

    schoolId:{
        type:Object,
        ref: "School"
        
    },
   
    commentDate: {
        type: Date,
        default: Date.now
    },

    subComment:{
        comments: {
            type: String
        },
        commentsByName: {
            type: String,
           
        },
    
        commentBy: {
            type: Object,
            ref: "SchoolUser"
        },
    
        schoolId:{
            type:Object,
            ref: "School"
            
        },
       
        commentDate: {
            type: Date,
            default: Date.now
        },
    }
   
});

module.exports = mongoose.model("Comment", commentSchema);
