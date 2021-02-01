const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    notificationId: {
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
    },
    additionalData: {
        type: Object
    },
    body: {
        type: String
    },
    isRead: {
        type: Boolean
    },
    timestamp: {
        type: String
    }
});


module.exports = mongoose.model("Notification", notificationSchema);


