const _ = require('lodash');
const User = require('../models/user');
const formidable = require('formidable');
const fs = require('fs');
const { uploadFileTos3 } = require('./videoupload');

exports.userById = (req, res, next, id) => {
    User.findById(id)
        // populate followers and following users array
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            req.profile = user; // adds profile object in req with user info
            next();
        });
};

exports.hasAuthorization = (req, res, next) => {
    let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
    let adminUser = req.profile && req.auth && req.auth.role === 'admin';

    const authorized = sameUser || adminUser;

    // console.log("req.profile ", req.profile, " req.auth ", req.auth);
    // console.log("SAMEUSER", sameUser, "ADMINUSER", adminUser);

    if (!authorized) {
        return res.status(403).json({
            error: 'User is not authorized to perform this action'
        });
    }
    next();
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(users);
    })
        .select('_id firstName lastName email address liveLocation dob studiedAt worksAt profileImageUrl visitedUsers testimonialUser fcmToken playerId hashed_password updated created role following followers friends profileDescription coverImageUrl');
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

// exports.updateUser = (req, res, next) => {
//     let user = req.profile;
//     user = _.extend(user, req.body); // extend - mutate the source object
//     user.updated = Date.now();
//     user.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: "You are not authorized to perform this action"
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json({ user });
//     });
// };



// exports.createPost = async (req, res, next) => {
//     try{
//         console.log("reqqq", req.file);
//     // let form = new formidable.IncomingForm();
//     // form.keepExtensions = true;
//     console.log("requset", req);

//         let post = new Post(req.body);

//         req.profile.hashed_password = undefined;
//         req.profile.salt = undefined;
//         post.postedBy = req.profile;

//         if (req.file) {
//             // post.photo.data = fs.readFileSync(files.photo.path);
//             // post.photo.contentType = files.photo.type;
          
//                  imageUrl =  await uploadFileTos3('images',req.file)
//                  console.log("imageurl", imageUrl);
//                  post.photo= imageUrl.url;
                              
//         }
//         post.save((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             res.json(result);
//         });
// }
// catch(error) {
//     console.log("errror",error)
// }
// };

exports.updateUser = async (req, res) => {
    console.log("API startted");
    //console.log("reqq", req.file);
    //let form = new formidable.IncomingForm();
   // console.log("incoming form data: ", form);
  //  form.keepExtensions = true;
    // form.parse(req, (err, fields, files) => {
    // if (err) {
    //     return res.status(400).json({
    //         error: 'Photo could not be uploaded'
    //     });
    // }
    // save user
    let user = req.profile;
    console.log("user in update: ", user);
    user = _.extend(user, req.body);
    console.log("API extended" + user)
    user.updated = Date.now();
     console.log("USER FORM DATA UPDATE: ", user);

    // if (req.file) {
    //     imageUrl =  await uploadFileTos3('images',req.file)
        
    //     console.log("imageurl", imageUrl);
    //     //user.photo= imageUrl.url;
    //     user.profileImageUrl= imageUrl.url;
    //     // user.photo.data = fs.readFileSync(files.photo.path);
    //     // user.photo.contentType = files.photo.type;
    // }

    user.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        // console.log("user after update with formdata: ", user);
        res.json(user);
    });
}

exports.uploadImage = async (req, res) => {
        try {
            console.log("req", req)
            const content = req.file;
            console.log("--------" + content);
            const image = await uploadFileTos3('images', req.file); // images is a directory in the Azure container
            return res.status(200).json({message: "image uploaded successfully", url:image});
        } catch (error) {
            console.log("--------error" + error);
            next(error);
        }

}
 // Visited Users
exports.visitedUsers = (req, res) => {
    let user = req.profile;
    User.findOne({ _id:user._id }, (err, user) => {
        // if err or no user
        if (err || !user){
            return res.status('401').json({
                error: 'User with that id does not exist!'
            });
        }
        user.visitedUsers.push({userId:req.body.visitedUserId, visitedTime:req.body.userVisitedTime})
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(user);
        });
    });

    };

exports.allVisitedUsers = (req, res) => {
    let user = req.profile;
    User.findOne({ _id:user._id }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(user);
    })
    .select('visitedUsers.userId visitedUsers.visitedTime')
   
};

// Testimonial User
exports.testimonialUser = (req, res) => {
    let user = req.profile;
    User.findOne({ _id:user._id }, (err, user) => {
        // if err or no user
        if (err || !user){
            return res.status('401').json({
                error: 'User with that id does not exist!'
            });
        }
        user.testimonialUser.push({userId:req.body.testimonialUserId, description:req.body.text, createdTime:req.body.createdAt})
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(user);
        });
    });

    };

exports.userPhoto = (req, res, next) => {
    console.log("reqqq", req);
    // if (req.profile.photo) {
    //     res.set(('Content-Type', req.profile.photo.contentType));
    //     return res.send(req.profile.photo);
    // }
    if (req.profile.profileImageUrl) {
        res.set(('Content-Type', req.profile.profileImageUrl.contentType));
        return res.send(req.profile.profileImageUrl);
    }
    next();
};



exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: 'User deleted successfully' });
    });
};

// follow unfollow
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

exports.findPeople = (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    User.find({ _id: { $nin: following } }, (err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(users);
    }).select('name');
};
