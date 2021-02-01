const express = require("express");
const {
    sendPushNotification
} = require("../controllers/pushNotification");

const router = express.Router();

router.post("/notification/sendpushnotification", sendPushNotification);


module.exports = router;