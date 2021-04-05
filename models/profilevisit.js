const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const profilevisitSchema = new mongoose.Schema({

    

    userId: {
        type: String,
        required: true

    },
    visitedBy: {
        type: ObjectId,
        ref: 'User'
    },
    visitedTime: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model("ProfileVisit", profilevisitSchema);


