const express = require("express");
const {
    requestFriend,
    getFriends,
    removeFriend

} = require("../controllers/friend");
const { requireSignin } = require("../controllers/auth");
const router = express.Router();

// router.post("/friend/requestfriend", requireSignin, requestFriend);
router.post("/friend/requestfriend", requestFriend);
router.post("/friend/removefriend", removeFriend);
router.get('/friend/getfriend/:userId', getFriends);
//router.param("userId", friendById);
module.exports = router;