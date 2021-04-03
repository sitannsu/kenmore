const express = require('express');
const { requireSignin } = require('../controllers/auth');
const { createPage, allPages, pageById } = require('../controllers/page');
const router = express.Router();

router.post('/page/create', requireSignin, createPage);
router.get('/pages', allPages);
router.get('/page/:pageID', pageById);
module.exports = router;