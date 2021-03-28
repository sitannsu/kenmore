const express = require('express');
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
const formidable = require('formidable');
const { imageUpload } = require('../controllers/post');

const router = express.Router();




//router.post('/image/upload', singleFileUpload.fields([{ name: 'file', maxCount: 5 }]),imageUpload);
router.post('/image/upload', singleFileUpload.array('file'),imageUpload);
// router.post('/media/mediainfo', uploadVideoInfo);
// router.get('/media/getallmedia', findAllmedia);
// router.post('/media/like', like);
// router.post('/media/comment', comment);

module.exports = router;