const express = require("express");
const {
    userById,
    allUsers,
    getUser,
    updateUser,
    deleteUser,
    userPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
    visitedUsers,
    allVisitedUsers,
    testimonialUser,
    hasAuthorization
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.put("/user/follow", addFollowing, addFollower);
router.put("/user/unfollow", removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
//router.post("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.post("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);
// photo
router.get("/user/photo/:userId", userPhoto);

// Visited Users
router.put("/user/visitprofile/:userId", visitedUsers);
router.get("/user/allvisitedusers/:userId",  allVisitedUsers);

// Testimonial
router.put("/user/:userId", testimonialUser);

// who to follow
router.get("/user/findpeople/:userId", requireSignin, findPeople);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
