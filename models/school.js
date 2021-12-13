const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const schoolSchema = new mongoose.Schema({
    createdOn: {
        type: String,
        default: Date.now
 
    },
    acName: {
        type: String,
        trim: true,
 
    },
    blockName: {
        type: String,
        trim: true,
    },
    pcName: {
        type: String,
        trim: true,
 
    },
    distName: {
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
    },
    
    comments: [
        {
            comment: String,
       
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: 'User' },
          
    
            likes: [ { userId:String , count: Number  }]
        }
    ]
    
});


module.exports = mongoose.model("School", schoolSchema);


