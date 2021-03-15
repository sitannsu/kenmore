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
    hasAuthorization,
    uploadImage
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

const router = express.Router();

router.put("/user/follow", addFollowing, addFollower);
router.put("/user/unfollow", removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
//router.post("/user/:userId", requireSignin, hasAuthorization, updateUser);
//router.post("/user/:userId",requireSignin, singleFileUpload.single('photo'),  updateUser);
//router.post("/user/:userId",requireSignin, singleFileUpload.single('profileImageUrl'),  updateUser);
router.put("/user/:userId",requireSignin,updateUser);
router.post("/updateImageUrl", singleFileUpload.single('imageUrl'),uploadImage);
router.delete("/user/:userId", deleteUser);
// photo
router.get("/user/photo/:userId", userPhoto);

// Visited Users
router.put("/user/visitprofile/:userId", visitedUsers);
router.get("/user/allvisitedusers/:userId",  allVisitedUsers);

// Testimonial
router.put("/testimonialUser/:userId", testimonialUser);

// who to follow
router.get("/user/findpeople/:userId", requireSignin, findPeople);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
