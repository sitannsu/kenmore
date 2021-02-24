const express = require('express');
const { message, allMessage } = require('../controllers/chat');

const router = express.Router();



router.post('/messages',  message);
router.get('/allMessages',  allMessage);

// any route containing :userId, our app will first execute userByID()
//router.param('userId', userById);

module.exports = router;




