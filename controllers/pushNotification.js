const User = require('../models/user');
const {sendNotification} = require("../utility")
exports.sendPushNotification = async (req, res) => {
    const receiver = await User.findOne({ _id: req.body.receiverUserId });
    //const sender = await User.findOne({ _id: req.body.senderUserId });
    console.log("api invoked");
    var message = {
       // app_id: "73d3f8d8-d268-498b-b1eb-43db090eeaab",
        app_id: "4caa225e-a77d-485c-bbc5-74e432aa6e2f",
        contents: { "en": req.body.message },
        include_player_ids: [receiver.playerId] //'48775227-9cc6-456c-ac55-467321e7173e'
    };
    sendNotification(message, res);

    //res.json(result);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
};

exports.sendNotification = (data, response, returnData) => {
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

