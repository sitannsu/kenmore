const express = require("express");
const { sendNotifications, getAllNotifications, updateNotification } = require("../controllers/notification");

const router = express.Router();

router.post("/sendnotifications", sendNotifications);
router.get("/notifications/:userId", getAllNotifications );
router.put("/updateNotification", updateNotification );


module.exports = router;