const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const AllSchoolsSchema = new mongoose.Schema({

    

    Sl_No: {
        type: String
 

    },
    District: {
        type: String
    
    },
    Block:{
     type:String,
     default:""
    },
    UDISE:{
        type:String,
        default:""
       },
       GP:{
        type:String,
        default:""
       },
       Constituency:{
        type:String,
        default:""
       },
       School_Name:{
        type:String,
        default:""
       },
       HM_Name:{
        type:String,
        default:""
       },
       HM_Contact:{
        type:String,
        default:""
       },
    
});


module.exports = mongoose.model("AllSchools", AllSchoolsSchema);

