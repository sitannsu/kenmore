const express = require("express");
const {
    requestFriend,
    getFriends,
    removeFriend,
    getAccepted

} = require("../controllers/friend");
const { requireSignin } = require("../controllers/auth");
const router = express.Router();

// router.post("/friend/requestfriend", requireSignin, requestFriend);
router.post("/friend/requestfriend", requestFriend);
router.post("/friend/removefriend", removeFriend);
router.get('/friend/getfriend/:userId', getFriends);
router.get('/friend/getfriendrequest/', getAccepted);
//router.param("userId", friendById);
module.exports = router;