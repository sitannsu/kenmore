const User = require('../models/user');
exports.sendPushNotification = async (req, res) => {
    const receiver = await User.findOne({ _id: req.body.receiverUserId });
    //const sender = await User.findOne({ _id: req.body.senderUserId });
    console.log("api invoked");
    var message = {
        app_id: "73d3f8d8-d268-498b-b1eb-43db090eeaab",
        contents: { "en": req.body.message },
        include_player_ids: [receiver.playerId] //'deb66713-0913-461a-a330-a67edb5fafb4'
    };
    sendNotification(message, res);

    //res.json(result);

};

exports.sendNotification = function (data, response, returnData = {}) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            console.log("Response:");
            console.log(JSON.parse(data));
            response.status(200).json({ message: 'Notification sent successfully', data: returnData });
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
        response.status(500).json({ error: 'Error occured in sending notification' + e });
    });

    req.write(JSON.stringify(data));
    req.end();
};

