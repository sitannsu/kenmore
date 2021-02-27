const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;
const Post = require("./post");

const videoSchema = new mongoose.Schema({
    userId: String,
    userProfileImageUrl: String,
    userName: String,
    title: String,
    description: String,
    mediaUrl: String,
    thumbnailUrl: String,
    type: String,
    createdDate: String,
    user: {
        type: ObjectId,
        ref: 'User'
    },
    // likes: [
    //     {
    //         likeBy: { type: ObjectId, ref: 'User' },
    //         text: String

    //     }],
    // comments: [
    //     {
    //         text: String,
    //         created: { type: Date, default: Date.now },
    //         postedBy: { type: ObjectId, ref: 'User' }
    //     }
    // ]

});



module.exports = mongoose.model("Video", videoSchema);
