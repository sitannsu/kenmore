const Testimonial = require("../models/testimonial");


 

exports.getAllTestimonial = async (req, res) => {
    Testimonial.find({ userId: req.body.userId })
    .populate('visitedBy', '_id firstName lastName profileImageUrl')
    .populate('likedBy', '_id firstName lastName')
   
    .sort('_created')
    .exec((err, posts) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(posts);
    });
        
};



exports.insertTestimonial = async (req, res) => {
     
    const testimonial = await new Testimonial(req.body);
    console.log("profilePage",req.profile)
    //user.createdBy = req.body.userId;
    await testimonial.save((err, result) => {
      
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({ message: 'success' });
    })
   
};