const express = require("express");
const { sendNotifications, getAllNotifications } = require("../controllers/notification");

const router = express.Router();

router.post("/sendnotifications", sendNotifications);
router.get("/notifications/:userId", getAllNotifications );


module.exports = router;