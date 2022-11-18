const mongoose = require("mongoose");
const kenmoreSchema = new mongoose.Schema({
   
    firstname: {
        type: String,
        trim: true,
 
    },
    lastname:{
        type:String,
        trim: true,
 
    },
    phone: {
        type: String,
        trim: true,
 
    },
   
    email: {
        type: String,
        trim: true,
 
    },
    address: {
        type: String,
        trim: true,
 
    },
    city: {
        type: String,
        trim: true,
  
    },
    zip: {
        type: String,
        trim: true,
 
    },
    comments: {
        type: String,
        trim: true,
 
    },
 
    interestedappliances: [{ type: String  }],
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Kenmore", kenmoreSchema);