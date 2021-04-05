const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const TestimonialSchema = new mongoose.Schema({

    

    userId: {
        type: String,
        required: true

    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    testimonialText:{
     type:String,
     default:""
    },
    visitedTime: {
        type: Date,
        default: Date.now
    },
    updatedTime: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model("Testimonial", TestimonialSchema);

