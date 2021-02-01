const express = require("express");
const { allNotifications, getAllNotifications } = require("../controllers/notification");

const router = express.Router();

router.post("/notifications", allNotifications);
router.get("/notifications/:userId", getAllNotifications );


module.exports = router;