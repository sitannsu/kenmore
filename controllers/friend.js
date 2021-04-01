
const User = require('../models/user');
const {sendNotification} = require("../utility")
var ObjectId = require('mongoose').Types.ObjectId;

exports.requestFriend =  (req, res) => {
    //console.log(req);
    console.log("api invoked");
    User.requestFriend(req.body.senderUserId, req.body.receiverUserId, async (err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
            const receiver = await User.findOne({ _id:  req.body.receiverUserId });
                const sender = await User.findOne({ _id: req.body.senderUserId });
                console.log("api invoked");
                var message = {
                    app_id: "2fda0b56-2f68-426c-8b70-8990d7817d1b",
                    contents: { "en": `${sender.name} sent you a friend request` },
                    include_player_ids: [receiver.playerId] //'deb66713-0913-461a-a330-a67edb5fafb4'
                };
                sendNotification(message, res, result);
    });
};



exports.getFriends = (req, res) => {
    console.log("get api involked" + req.params.userId)
    User.getFriends(req.params.userId, function (err, friendships) {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(friendships);
    });
}

exports.removeFriend = (req, res) => {
    //console.log(req);
    var user1Id = new ObjectId(req.body.senderUserId);
    var user2Id = new ObjectId(req.body.receiverUserId);
    console.log("api invoked", user1Id);
    console.log("api invoked", user1Id);
    User.removeFriend(user1Id, user2Id, function (err, friendships) {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        
        //console.log("result", friendships)
        res.json(friendships);
    });
};