const express = require('express');
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
const formidable = require('formidable');

const router = express.Router();

const {
    imageUpload,
} = require('../controllers/videoupload');



router.post('/video/upload', singleFileUpload.single('file'), imageUpload);
// router.post('/media/mediainfo', uploadVideoInfo);
// router.get('/media/getallmedia', findAllmedia);
// router.post('/media/like', like);
// router.post('/media/comment', comment);

module.exports = router;