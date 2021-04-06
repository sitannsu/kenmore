const express = require('express');
const { requireSignin } = require('../controllers/auth');

const { insertTestimonial, getAllTestimonial } = require('../controllers/testimonial');
const router = express.Router();
const { userById } = require('../controllers/user');





router.post('/testimonial/create', requireSignin, insertTestimonial);
router.get('/testimonial/:userId', getAllTestimonial);
 



router.param('userId', userById);
module.exports = router;