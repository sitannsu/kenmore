const ProfileVisit = require('../models/profilevisit');
const formidable = require('formidable');

 

exports.getAllProfileVisit = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 6;
    let totalItems;

    const ProfileVisit = await ProfileVisit.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate('comments', 'text created')
                .populate('comments.postedBy', '_id firstName lastName profileImageUrl')
                .populate('postedBy', '_id firstName lastName profileImageUrl')
                .select('_id title body created likes photo')
                .limit(perPage)
                .sort({ created: -1 });
        })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => console.log(err));
};


exports.insertProfileVisit = async (req, res) => {
        
    
    const profileVisit = await new ProfileVisit(req.body);
    console.log("profilePage",req.profile)
    user.createdBy= req.profile;
    await profileVisit.save((err, result) => {
      
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({ message: 'success' });
    })
   
};