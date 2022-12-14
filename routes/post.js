const express = require('express');
const {
    getPosts,
    getPostsByUser,
    createPost,
    postsByUser,
    postById,
    isPoster,
    updatePost,
    deletePost,
    photo,
    singlePost,
    like,
    likeComment,
    unlike,
    comment,
    uncomment,
    updateComment,
    postSearchByKeyword,
    createSchool,
    getSchoolsByBlock,
    getALlBlockByDist,
    getALlBlockByDist2,
    getSchools,
    getSchoolDetails,
    createSchoolDistricts,
    getSchoolBlocks,
    getSchoolListByBlock,
    getSchoolDistricts,
    getSchoolDistricts2,
    createUser,
    getALlBlockByDist3,
    getUserList,
    userAuth,
    createComments,
    createSubComments,
    getComments,
    updateSchoolStatus,
    getSchoolsByBlock2,
    getSchoolDetailsById



    
    
} = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
var upload = multer({ storage: inMemoryStorage });
const router = express.Router();

router.get('/posts', getPosts);

// like unlike
router.put('/post/like', requireSignin, like);
//router.put('/post/unlike', requireSignin, unlike);
router.put('/post/unlike', requireSignin, unlike);

// comments
router.put('/post/comment', requireSignin, comment);
router.put('/post/comment/like', requireSignin, likeComment);
router.put('/post/uncomment', requireSignin, uncomment);
router.put('/post/updatecomment', requireSignin, updateComment);

// post routes
router.post('/post/new/:userId',requireSignin, upload.array('photo', 10),  createPost);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.get('/post/:postId', singlePost);
router.put('/post/:postId', requireSignin,upload.array('photo', 10), updatePost);
router.post('/post/delete/:postId', requireSignin, isPoster, deletePost);

router.post('/post/search', requireSignin, postSearchByKeyword);

//router.delete('/post/comment/:commentId', requireSignin, isPoster, deletePost);

// photo
router.get('/post/photo/:postId', photo);


router.post('/addSchool', createSchool);
router.get('/getALlschools', getSchools);
router.get('/getALlschoolsByBlock/:blockName', getSchoolsByBlock);
router.get('/getALlschoolsByBlock2/:blockName', getSchoolsByBlock2);
router.get('/getALlBlockByDist/:distName', getALlBlockByDist);
router.get('/getSchoollCountInAllBlock', getALlBlockByDist2);
router.get('/getSchoolDetails/:schoolId', getSchoolDetails);

router.get('/getSchoollForADistStatitics/:distName', getALlBlockByDist3);
router.get('/getSchoolDetailsById/:schoolId', getSchoolDetailsById);
router.get('/getSchoolDistricts', getSchoolDistricts);
router.get('/getSchoolDistricts2', getSchoolDistricts2);
router.post('/getSchoolBlocks', getSchoolBlocks);
router.post('/getSchoolListByBlock', getSchoolListByBlock);




router.post('/createUser', createUser);
router.get('/getUserList', getUserList);


router.post('/createComments', createComments);
router.get('/getComments/:schoolId', getComments);

router.put('/createSubComments', createSubComments);
router.put('/updateSchoolStatus', updateSchoolStatus);

router.post('/userAuth', userAuth);

router.post('/createSchoolDistricts', createSchoolDistricts);

//router.post('/addComments', addComments);
//router.get('/getComments', getComments);

// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('postId', postById);

module.exports = router;
