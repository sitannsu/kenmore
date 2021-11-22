const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const schoolSchema = new mongoose.Schema({
  
    acName: {
        type: String,
        trim: true,
 
    },
    blockName: {
        type: String,
        trim: true,
    },
    code: {
        type: String
    },
    eLibrary: {
        type: String
    },
 
    schoolName:{
        type: String
    },
    noOfSmartClass:{
        type: String
    },
    sanitization: {
        type: String
    }
    ,
    scienceLab: {
        type: String
    }
    ,
    smartClasses: {
        type: String
    }    ,
    sport: {
        type: String
    }
});


module.exports = mongoose.model("School", schoolSchema);


