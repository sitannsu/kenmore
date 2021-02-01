const mongoose = require("mongoose");
//const uuidv1 = require("uuid/v1");
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;
const Post = require("./post");
var friends = require("mongoose-friends");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    // fcmToken: {
    //     type: String,
    //     required: true
    // },
    // playerId: {
    //     type: String,
    //     required: true
    // },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    pinCode: {
        type: String
    },
    profileImageUrl: {
        type: String
    },
    showAdd: {
        type: Boolean
    },
    about: {
        type: String,
        trim: true
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
    resetPasswordLink: {
        data: String,
        default: ""
    },
    role: {
        type: String,
        default: "subscriber"
    },
    bankAccountNumber: {
        type: String
    },
    bankAccountProof: {
        type: String
    },

    addressProof: {
        type: String
    }

});

/**
 * Virtual fields are additional fields for a given model.
 * Their values can be set manually or automatically with defined functionality.
 * Keep in mind: virtual properties (password) don’t get persisted in the database.
 * They only exist logically and are not written to the document’s collection.
 */

// virtual field
userSchema
    .virtual("password")
    .set(function (password) {
        // create temporary variable called _password
        this._password = password;
        // generate a timestamp
        this.salt = uuidv4();
        // encryptPassword()
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// methods
userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
         if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

// pre middleware
userSchema.pre("remove", function (next) {
    Post.remove({ postedBy: this._id }).exec();
    next();
});
userSchema.plugin(friends());
module.exports = mongoose.model("User", userSchema);
