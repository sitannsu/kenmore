const express = require('express');
const { requireSignin } = require('../controllers/auth');
const { getAllProfileVisit , insertProfileVisit} = require('../controllers/profilevisit');
const router = express.Router();
const { userById } = require('../controllers/user');





router.post('/profileVisit/create', requireSignin, insertProfileVisit);
router.get('/profileVisit/:userId', getAllProfileVisit);
 



router.param('userId', userById);
module.exports = router;