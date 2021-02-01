const mongoose = require("mongoose");


const userAddClickSchema = new mongoose.Schema({
    userId: {
        type:String,
       
    },
    noOfAddClick: {
          type: Number
    },
   
     timestamp: {
      type: Date, 
      default: Date.now 
    }
});


module.exports = mongoose.model("UserAddClick", userAddClickSchema);


