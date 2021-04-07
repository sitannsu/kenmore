const { result } = require('lodash');
const notification = require('../models/notification');
const Notification = require('../models/notification');
const User = require('../models/user');
var mongoose = require('mongoose');


exports.sendNotifications = async (req, res) => {


    User.findOne({ _id: req.body.user }, (err, user)=>{

        if(!user){
            return res.status(400).json({
                error: "User does not exist"
            });
        }

        const notification = new Notification(req.body);
        //console.log("useruseruseruser",user);
        notification.user = {_id:user._id , profileImageUrl:user.profileImageUrl, firstName:user.firstName,
             lastName:user.lastName};
        notification.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.status(200).json(result);
        });
    })


     
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
