const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const User = require('../models/user');
const {sendNotification} = require("../utility")
const { uploadFileTos3, uploadVideoTos3 } = require('./videoupload');
const { LoginTicket } = require('google-auth-library');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id firstName lastName')
        .populate('likes.likedBy', '_id firstName lastName profileImageUrl')
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
//    console.log("requset", req);

        let post = new Post(req.body);
       console.log("requested file ",req.file)
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        
        if (req.files) {
            // post.photo.data = fs.readFileSync(files.photo.path);
            // post.photo.contentType = files.photo.type;
            for(var i=0; i<req.files.length; i++){
                imageUrl =  await uploadFileTos3('images',req.files[i])
                console.log("imageurl", req.files[i]);
                post.photo.push(imageUrl.url);
            }
                 
                              
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
        .populate('likedBy', '_id firstName lastName')
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

    let isPoster = (req.body.userId.toString=== req.post.postedBy._id.toString) ? false: true;
    console.log("isPosterisPoster",isPoster);

    if (req.body.userId.toString()!== req.post.postedBy._id.toString()) {
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

exports.updatePost = async(req, res, next) => {
    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;
    // form.parse(req, (err, fields, files) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: 'Photo could not be uploaded'
    //         });
    //     }
    //     // save post
    //     let post = req.post;
    //     post = _.extend(post, fields);
    //     post.updated = Date.now();

    //     if (files.photo) {
    //         post.photo.data = fs.readFileSync(files.photo.path);
    //         post.photo.contentType = files.photo.type;
    //     }

    //     post.save((err, result) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: err
    //             });
    //         }
    //         res.json(post);
    //     });
    // });
    console.log("api started")
    try{
        console.log("reqqq", req.file);
        let post = req.post;
        post = _.extend(post, req.body);
        post.updated = Date.now();
       console.log("requested file ",req.file)
    
        if (req.files) {
            for(var i=0; i<req.files.length; i++){
                imageUrl =  await uploadFileTos3('images',req.files[i])
                console.log("imageurl", req.files[i]);
                post.photo.push(imageUrl.url);
            }
                 
                              
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
    let like = req.body;
    like.likedBy = req.body.userId;

    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: like } }, { new: true })
    .populate('likes.likedBy', '_id firstName lastName profileImageUrl')
 
    .exec(async(err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
        
            const receiverPost = await Post.findOne({ _id:  req.body.postId })
            //.postedBy
            //.postedBy._id;
            console.log("receiverUserId",receiverPost.postedBy)
            const receiver =   await User.findOne({ _id: receiverPost.postedBy });
            console.log("receiver",receiver)
            const sender = await User.findOne({ _id: req.body.userId });
           // console.log("sender.name", req.body.senderUserId);
            console.log("receiver.playerId",receiver.playerId);
            var message = {
                
                app_id: "2fda0b56-2f68-426c-8b70-8990d7817d1b",
                contents: { "en": `${sender.firstName} ${sender.lastName} likes your post` },
                include_player_ids: [receiver.playerId], //'deb66713-0913-461a-a330-a67edb5fafb4'
                data:{ profileImageUrl:sender.profileImageUrl,senderUserId:sender._id}
               
            };
            sendNotification(message, res, result);

           // res.json(result);
        }
    });
 

};

exports.unlike = (req, res) => {
    console.log("body", req.body)
    Post.findById(req.body.postId, (error, requiredPost)=>{
     let likeObjectIndex = requiredPost? requiredPost.likes.findIndex(item => {
    return item.userId === req.body.userId
     }):-1;

     likeObject = requiredPost.likes.filter(function(el) { return el.userId != req.body.userId });
     requiredPost.likes = likeObject
   
    
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

exports.comment = (req, res) => {
    let comment = {text:req.body.comment};
    comment.postedBy = req.body.userId;
if(req.body.userId === null ||req.body.postId=== null ){
    res.status(500).json({message:'Post ID or User Id is missing'})
}
    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec(async(err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                const receiverPost = await Post.findOne({ _id:  req.body.postId })
                //.postedBy
                //.postedBy._id;
                console.log("receiverUserId",receiverPost.postedBy)
                const receiver =   await User.findOne({ _id: receiverPost.postedBy });
                //console.log("receiver",receiver)
                const sender = await User.findOne({ _id: req.body.userId });
               // console.log("sender.name", req.body.senderUserId);
                console.log("receiver.playerId",receiver.playerId);
                var message = {
                    
                    app_id: "2fda0b56-2f68-426c-8b70-8990d7817d1b",
                    contents: { "en": `${sender.firstName} ${sender.lastName} commented on your post.` },
                    include_player_ids: [receiver.playerId], //'deb66713-0913-461a-a330-a67edb5fafb4'
                    data:{ profileImageUrl:sender.profileImageUrl,senderUserId:sender._id}
                   
                };
                if(receiverPost.postedBy.toString() ===req.body.userId.toString() ){
                   //res.json(result);
                   res.status(200).json(result);
                }else{
                    
                    sendNotification(message, res, result);
                }
                
             
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

exports.disslikeComment = (req, res) => {
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
    requiredPost.remove()
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

exports.uncomment = (req, res) => {
 

    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: req.body.commentId} } } )
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
exports.imageUpload = async (req, res, next) => {
    try {
        console.log("req", req.files)
        const content = req.file;
      //  console.log("--------" + content);
        const image = await uploadVideoTos3('images', req.files); // images is a directory in the Azure container
        console.log("image data",image)
        return res.status(200).json({message: "image uploaded successfully", url:image});
     
    } catch (error) {
        console.log("--------error" + error);
        next(error);
    }
  };