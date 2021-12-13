const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
   
    comments: {
        type: String,
        trim: true,
        required: true
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
   
});

module.exports = mongoose.model("Comment", commentSchema);
