const express = require('express');
const { requireSignin } = require('../controllers/auth');
const { createPage, allPages, pageById, pageUserById,allPagesForUser } = require('../controllers/page');
const router = express.Router();

router.post('/page/create/:pageUserId', requireSignin, createPage);
router.get('/pages/:pageUserId', allPagesForUser);
router.get('/page/:pageID', pageById);



router.param('pageUserId', pageUserById);
module.exports = router;