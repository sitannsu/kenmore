const express = require("express");
const { sendNotifications, getAllNotifications, updateNotification, saveKenmoreData } = require("../controllers/notification");

const router = express.Router();

router.post("/sendnotifications", sendNotifications);
router.get("/notifications/:userId", getAllNotifications );
router.put("/updateNotification", updateNotification );
router.post("/saveKenmoreData", saveKenmoreData);


module.exports = router;