const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const { uploadFileTos3 } = require('./videoupload');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id firstName lastName')
        .populate('comments.postedBy', '_id firstName lastName profileImageUrl')
        .populate('postedBy', '_id firstName lastName role')
        .select('_id title body created likes comments photo')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
};

/*
exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .select("_id title body created likes")
        .sort({ created: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};
*/

// with pagination
exports.getPosts = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 6;
    let totalItems;

    const posts = await Post.find()
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

exports.createPost = async (req, res, next) => {
    try{
        console.log("reqqq", req.file);
    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;
    console.log("requset", req);

        let post = new Post(req.body);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        
        if (req.file) {
            // post.photo.data = fs.readFileSync(files.photo.path);
            // post.photo.contentType = files.photo.type;
          
                 imageUrl =  await uploadFileTos3('images',req.file)
                 console.log("imageurl", imageUrl);
                 post.photo= imageUrl.url;
                              
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
}
catch(error) {
    console.log("errror",error)
}
};

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id firstName lastName')
        .populate('comments', 'text created')
        .select('_id title body created likes photo')
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

exports.isPoster = (req, res, next) => {
    let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    let adminUser = req.post && req.auth && req.auth.role === 'admin';

    // console.log("req.post ", req.post, " req.auth ", req.auth);
    // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

    let isPoster = sameUser || adminUser;

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

// exports.updatePost = (req, res, next) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(post);
//     });
// };

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};

exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Post deleted successfully'
        });
    });
};

exports.photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

exports.singlePost = (req, res) => {
    return res.json(req.post);
};

exports.like = (req, res) => {
    console.log("body", req.body)
    Post.findById(req.body.postId, (error, requiredPost)=>{
     let likeObjectIndex = requiredPost? requiredPost.likes.findIndex(item => {
    return item.userId === req.body.userId
     }):-1;

    if(likeObjectIndex>-1){
        likeObject= {...requiredPost.likes[likeObjectIndex], userId:req.body.userId , count:requiredPost.likes[likeObjectIndex].count + 1}
        requiredPost.likes[likeObjectIndex] = likeObject
    }
    else {
        likeObject = {userId:req.body.userId, count:1}
        requiredPost.likes.push(likeObject)
    }
    requiredPost.save()
    // Post.updateOne((item) => {item._id === req.body.postId})
    // (
    //     (err, result) => {
    //         console.log("err", err)
    //         if (err) {
    //             return res.status(400).json({
    //                 error: err
    //             });
    //         } else {
    //             res.json(result);
    //         }
    //     }
    // );
    if (error) {
        console.log("err", error)
        return res.status(400).json({
       error: error

        });
    } else {
        res.json(requiredPost);
    }
 })

};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

exports.comment = (req, res) => {
    let comment = {text:req.body.comment};
    comment.postedBy = req.body.userId;
if(req.body.userId === null ||req.body.postId=== null ){
    res.status(500).json({message:'Post ID or User Id is missing'})
}
    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

exports.likeComment = (req, res) => {
    console.log("body", req.body)
    Post.findById(req.body.postId, (error, requiredPost)=>{
      let commentObjectIndex=  requiredPost? requiredPost.comments.findIndex(item => {
        return item._id.toString() === req.body.commentId
         }):-1; 
         console.log("commentIndex", commentObjectIndex);
         console.log("requiredPost", requiredPost);
     let likeObjectIndex = requiredPost? requiredPost.comments[commentObjectIndex].likes.findIndex(item => {
    return item.userId === req.body.userId
     }):-1;

    if(likeObjectIndex>-1){
        likeObject= {...requiredPost.comments[commentObjectIndex].likes[likeObjectIndex], userId:req.body.userId , count:requiredPost.comments[0].likes[likeObjectIndex].count + 1}
        requiredPost.comments[commentObjectIndex].likes[likeObjectIndex] = likeObject
    }
    else {
        likeObject = {userId:req.body.userId, count:1}
        requiredPost.comments[commentObjectIndex].likes.push(likeObject)
    }
    requiredPost.save()
      if (error) {
        console.log("err", error)
        return res.status(400).json({
       error: error

        });
    } else {
        res.json(requiredPost);
    }
})
};

// exports.likeComment = (req, res) => {
//     console.log("body", req.body)
//     Post.findById(req.body.postId, (error, requiredPost)=>{
//      let likeObjectIndex = requiredPost? requiredPost.comments[0].likes.findIndex(item => {
//     return item.userId === req.body.userId
//      }):-1;
//      requiredPost.comments.findById(req.body.postId, (error, requiredPost)=>{
//         let likeObjectIndex = requiredPost? requiredPost.comments[0].likes.findIndex(item => {
//        return item.userId === req.body.userId
//         }):-1;
// //     if(likeObjectIndex>-1){
// //         likeObject= {...requiredPost.comments[0].likes[likeObjectIndex], userId:req.body.userId , count:requiredPost.comments[0].likes[likeObjectIndex].count + 1}
// //         requiredPost.comments[0].likes[likeObjectIndex] = likeObject
// //     }
// //     else {
// //         likeObject = {userId:req.body.userId, count:1}
// //         requiredPost.comments[0].likes.push(likeObject)
// //     }
// //     requiredPost.save()
// //       if (error) {
// //         console.log("err", error)
// //         return res.status(400).json({
// //        error: error

// //         });
// //     } else {
// //         res.json(requiredPost);
// //     }
//  })
// };

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

// exports.updateComment = async (req, res) => {
//     const comment = req.body.comment;
//     // const id = req.body.id;
//     const postId = req.body.postId;
//     const userId = req.body.userId;
//     // comment.postedBy = req.body.userId;

//     const result = await Post.findByIdAndUpdate(
//         postId,
//         {
//             $set: {
//                 comments: {
//                     _id: comment._id,
//                     text: comment.text,
//                     postedBy: userId
//                 }
//             }
//         },
//         { new: true, overwrite: false }
//     )
//         .populate('comments.postedBy', '_id name')
//         .populate('postedBy', '_id name');
//     res.json(result);
// };

exports.updateComment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            Post.findByIdAndUpdate(
                req.body.postId,
                { $push: { comments: comment, updated: new Date() } },
                { new: true }
            )
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        });
                    } else {
                        res.json(result);
                    }
                });
        }
    });
};

/*

// update commennt by Alaki
exports.updateComment = async (req, res) => {
  const commentId = req.body.id;
  const comment = req.body.comment;

  const updatedComment = await Post.updateOne(
    { comments: { $elemMatch: { _id: commentId } } },
    { $set: { "comments.$.text": comment } }
  );
  if (!updatedComment)
    res.status(404).json({ message: Language.fa.NoPostFound });

  res.json(updatedComment);
};

// update commennt with auth
exports.updateComment = async (req, res) => {
  const commentId = req.body.id;
  const comment = req.body.comment;
  const postId = req.params.id;

  const post = await Post.findById(postId);
  const com = post.comments.map(comment => comment.id).indexOf(commentId);
  const singleComment = post.comments.splice(com, 1);
  let authorized = singleComment[0].commentedBy;
  console.log("Security Check Passed ?", req.auth._id == authorized);

  if (authorized != req.auth._id)
    res.status(401).json({ mesage: Language.fa.UnAuthorized });

  const updatedComment = await Post.updateOne(
    { comments: { $elemMatch: { _id: commentId } } },
    { $set: { "comments.$.text": comment } }
  );
  if (!updatedComment)
    res.status(404).json({ message: Language.fr.NoPostFound });

  res.json({ message: Language.fr.CommentUpdated });
};
 */
