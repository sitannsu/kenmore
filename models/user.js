const mongoose = require("mongoose");
//const uuidv1 = require("uuid/v1");
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;
const Post = require("./post");
var friends = require("mongoose-friends");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    phone:{
        type:Number,
        trim: true,
        required: true
    },
    isTermsConditions:{
        type:Boolean, 
        required:true
    },

    fcmToken: {
        type: String,
       // required: true
    },
    playerId: {
        type: String,
       // required: true
    },
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
    // photo: {
    //     data: Buffer,
    //     contentType: String
    // },
    // photo: {
    //     type: String,
    //     trim: true,
    // },
    profileDescription: {
        type: String,
        default:""
    },
    CompanyName:{
        type:String,
        default:""
    },
    CompanyPosition:{
        type:String,
        default:""
    },
    CompanyLocation:{
        type:String,
        default:""
    },
    UnivercityName:{
        type:String,
        default:""
    },
    PreUnivercityName:{
        type:String,
        default:""
    },
    HighSchoolName:{
        type:String,
        default:""
    },
    CurrentState:{

        type:String,
        default:""  
    },
    CurrentPlaceCounty:{

        type:String,
        default:""  
    },
    CurrentPlaceCity:{

        type:String,
        default:""  
    },

FromState:{
    type:String,
    default:""  

},
FromCountry:{
    type:String,
    default:""  

},
FromCity:{
    type:String,
    default:""  

},

    coverImageUrl: {
        type: String,
        default: ""
    },
    profileImageUrl: {
        type: String,
        default: ""
    },

    address:{
        type: String,
        default: ""
    },
    liveLocation:{
        type: String,
        default: ""
    },
    dob:{
        type: Date,
        default: ""
    },
    studiedAt:{
        type: String,
        default: ""
    },
    worksAt:{
        type: String,
        default: ""
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
   

    visitedUsers:[ { userId:String , visitedTime:{ type: Date, default: Date.now } } ],
    testimonialUser: [
        {
            description:String,
            userId:String,
            createdTime: { type: Date, default: Date.now }
        }
    ]

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
