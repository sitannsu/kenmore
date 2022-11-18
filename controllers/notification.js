const { result } = require('lodash');
const notification = require('../models/notification');
const Notification = require('../models/notification');
const User = require('../models/user');
const Kenmore = require('../models/Kenmore');
var mongoose = require('mongoose');


exports.sendNotifications = async (req, res) => {


    try{
        console.log("reqqq", req.file);
    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;
//    console.log("requset", req);

        let post = new AllSchools(req.body);
        
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}
catch(error) {
    console.log("errror",error)
}


     
};

exports.saveKenmoreData = async (req, res) => {



    const kenmore = new Kenmore(req.body);
    //console.log("useruseruseruser",user);
  
    kenmore.save((err, result) => {
        if (err) {
            return res.status(400).json({
                "status": "FAIL",
                "responseCode": "500"
            });
        }
        res.status(200).json({ "status": "SUCCESS",
        "responseCode": "200 OK"});
    });

     
};
exports.getAllNotifications = async (req, res) => {
    //console.log(req.params.userId.toString());
    Notification.find({user: req.params.userId})
        .populate('user', '_id firstName profileImageUrl')
        .exec((err, notification) => {
            
            if (err || !notification) {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving notes."
                });
            }
            //req.profile = user; 
            res.status(200).json({
                notification
            });
            // adds profile object in req with user info
            //next();
        });








  
     
};

exports.updateNotification = (req,res)=>{
    

 
Notification.findOne({_id:req.body.notificationId},(error,notification)=>
{
    if(error){
        res.status(400).json({
            error:'notification does not exist'
        })
    }
    notification.isRead=req.body.isRead;


    notification.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }

        // console.log("user after update with formdata: ", user);
        res.json(result);
    });
})


   


}
