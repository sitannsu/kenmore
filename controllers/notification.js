const { result } = require('lodash');
const notification = require('../models/notification');
const Notification = require('../models/notification');

exports.sendNotifications = async (req, res) => {

    const notification = new Notification(req.body);
    notification.user = req.body.currentUserId;
    notification.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    });
     
};

exports.getAllNotifications = async (req, res, userId) => {
    Notification.find({currentUserId:userId})
        .populate('user', '_id name profileImageUrl')
      .then((data) => {
        res.send(data);
    })
       .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
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
