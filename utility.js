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
