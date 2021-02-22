const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
   
    name: {
        type: String,
        trim: true,
        required: true
    },
    userId:{
        type:String,
        trim: true,
        required: true
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
   
    created: {
        type: Date,
        default: Date.now
    },
   
});

module.exports = mongoose.model("ChatMessage", chatSchema);
