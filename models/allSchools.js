const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const AllSchoolsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },

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
       physical_unitsSMart:{
        type:Number,
        default:2
       },

       smart_classes:{
        physical_units:{
            type:Number,
            default:0
           },
           implement_agency:{
            type:String,
            default:""
           },
           deadline:{
            type: Date,
            default: Date.now
           },
           work_status:{
            type:String,
            default:""
           },
    
       },

       science_lab:{
        physical_units:{
            type:Number,
            default:0
           },
           implement_agency:{
            type:String,
            default:""
           },
           deadline:{
            type: Date,
            default: Date.now
           },
           work_status:{
            type:String,
            default:""
           },
    
       },


       e_library:{
        physical_units:{
            type:Number,
            default:0
           },
           implement_agency:{
            type:String,
            default:""
           },
           deadline:{
            type: Date,
            default: Date.now
           },
           work_status:{
            type:String,
            default:""
           },
    
       },

       sanitisation:{
        physical_units:{
            type:Number,
            default:0
           },
           implement_agency:{
            type:String,
            default:""
           },
           deadline:{
            type: Date,
            default: Date.now
           },
           work_status:{
            type:String,
            default:""
           },
    
       },

       sports:{
        physical_units:{
            type:Number,
            default:0
           },
           implement_agency:{
            type:String,
            default:""
           },
           deadline:{
            type: Date,
            default: Date.now
           },
           work_status:{
            type:String,
            default:""
           },
    
       },
    
});


module.exports = mongoose.model("AllSchools", AllSchoolsSchema);

