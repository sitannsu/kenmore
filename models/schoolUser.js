const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { v1: uuidv4} = require('uuid');
const crypto = require("crypto");

const schoolUserSchema = new mongoose.Schema({
    createdOn: {
        type: String,
        default: Date.now
 
    },
    userName: {
        type: String,
        trim: true,
 
    },
    userType: {
        type: String,
        trim: true,
    },
    userDistrict: {
        type: String,
        trim: true,
 
    },
    userBlock: {
        type: String,
        trim: true,
    },

    userAC: {
        type: String
    },
    userSchool: {
        type: String
    },
 
    hashed_password: {
        type: String 
    },
});

schoolUserSchema
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
schoolUserSchema.methods = {
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

module.exports = mongoose.model("SchoolUser", schoolUserSchema);


