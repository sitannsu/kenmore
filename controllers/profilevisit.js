const ProfileVisit = require('../models/profilevisit');
const formidable = require('formidable');

 

exports.getAllProfileVisit = async (req, res) => {




    ProfileVisit.find({ userId: req.body.userId })
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


exports.insertProfileVisit = async (req, res) => {
        
    
    const profileVisit = await new ProfileVisit(req.body);
    console.log("profilePage",req.profile)
    //user.createdBy = req.body.userId;
    await profileVisit.save((err, result) => {
      
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({ message: 'success' });
    })
   
};