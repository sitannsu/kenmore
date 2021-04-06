
const aws = require('aws-sdk');
const Jimp = require('jimp');
const getStream = require('get-stream');
//const s3 = new aws.S3();
//   const fileName = req.query['file-name'];
//   const fileType = req.query['file-type'];
//   const s3Params = {
//     Bucket: 'vanamimage',
//     Key: AKIAJEHKNPKWPG2AB6RA,
//     Expires: 60,
//     ContentType: fileType,
//     ACL: 'public-read'
//   };

//   s3.getSignedUrl('putObject', s3Params, (err, data) => {
//     if(err){
//       console.log(err);
//       return res.end();
//     }
//     const returnData = {
//       signedRequest: data,
//       //url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//       url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//     };
//     res.write(JSON.stringify(returnData));
//     res.end();
//   });


// const Videoupload = require('../models/videoupload')
// const User = require('../models/user');
// const express = require('express')
// const app = express()
// const port = 6000
// const bodyParser = require('body-parser');
// const multer = require('multer')
// const inMemoryStorage = multer.memoryStorage();
// const singleFileUpload = multer({ storage: inMemoryStorage });
// const {
//     sendPushNotification, sendNotification
// } = require("../controllers/pushNotification");
// const getStream = require('into-stream');


// const account = "friendstubeblob";
// const accountKey = "8vLDcRyxCxsahmTbJDUAnWSq5x7FCyScJQoDDxRlZ4Xr1GupT4kALAmNMrhp2Vqq/BKT/CMa+isgiGF4KNejaQ==";
// const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

// const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
// const blobServiceClient = new BlobServiceClient(
//     `https://${account}.blob.core.windows.net`,
//     sharedKeyCredential
// );


// const containerName = `videocontainer${new Date().getTime()}`;




// upload = async (directoryPath, file) => {

//     console.log("before call");
//     try {
//         const containerClient = blobServiceClient.getContainerClient(containerName);
//         console.log("-------1-----");
//         var createContainerResponse;
//         if (!(await containerClient.exists())) {
//             createContainerResponse = await containerClient.create();
//         }

//         console.log("-------2-----");
//         console.log(`Create container ${containerName} successfully`, createContainerResponse);
//         console.log("-------3-----");

//         const blobName = getBlobName(file.originalname);
//         const stream = getStream(file.buffer);
//         const streamLength = file.buffer.length;
//         console.log("streamLength", streamLength);

//         const content = stream;
//         console.log(content);

//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//         const uploadBlobResponse = await blockBlobClient.upload(content, streamLength);
//         console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse);
//     } catch (ex) {
//         console.log(ex);

//     }
// };


// const azureStorageConfig = {
//     accountName: "friendstubeblob",
//     accountKey: "8vLDcRyxCxsahmTbJDUAnWSq5x7FCyScJQoDDxRlZ4Xr1GupT4kALAmNMrhp2Vqq/BKT/CMa+isgiGF4KNejaQ==",
//     blobURL: `https://friendstubeblob.blob.core.windows.net/`,
//     containerName: `videocontainer`
// };

// exports.uploadFileTos3 = ( (directoryPath, image)=>{
//     return new Promise(async (resolve, reject) => {
//         let s3bucket = new aws.S3({
//             accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//             secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//            //region: process.env.AWS_REGION
//           });
//           const file = await Jimp.read(Buffer.from(image.buffer, 'base64'))
//           .then(async image => {
//             //const background = await Jimp.read('https://url/background.png');
//            // const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
//             //image.resize(Jimp.AUTO, 900);
//            // image.composite(background, 1000, 700);
//            // image.print(font, 1000, 700, 'Logo');
//             return image.getBufferAsync(Jimp.AUTO);
//           })


//           var ResponseData = [];
//        // const file = image.buffer


//           const params = {
//             Bucket:  process.env.AWS_BUCKET_NAME,
//             Key: image.originalname,
//             Body: file,
//             ContentType: image.mimetype,
//             ACL: 'public-read'
//           };
//        // const s3 = new aws.S3();
//         console.log("File", image);
//         const fileName = image.originalname;
//         //const fileType = req.query['file-type'];
//         const s3Params = {
//           Bucket: 'vanamimage',
//           Key: fileName,
//           Expires: 60,
//           ContentType: image.mimetype,
//           ACL: 'public-read'
//         };
//         console.log("param", params)
//         s3bucket.upload(params,  (err, data) => {
//             // if(err){
//             //   console.log(err);
//             //   reject(err);
//             // }
//             // else{
//             //     resolve({
//             //         url: `https://vanamimage.s3.us-east-2.amazonaws.com/${fileName}`
//             //     });
//             // }
//             if (err) {
//               resolve({ "error": true, "Message": err});
//             }else{
//                 ResponseData.push(data.Location);
//                 if(ResponseData.length == file.length){
//                   resolve({  url: ResponseData});
//                 }
//               }
//           });

// })
// })
// exports.uploadFileTos3 = ((directoryPath, video,req) => {
//   return new Promise(async (resolve, reject) => {
//     let s3bucket = new aws.S3({
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     });
//     var ResponseData = [];
//     console.log("video",video)

 
//   const file = video;
 
//      file.map((item) => {
//       const fileName = item.originalname;
//       var params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: item.originalname,
//         Body: item.buffer,
//         ACL: 'public-read'
//   };
// s3bucket.upload(params, function (err, data) {
//         // if (err) {
//         //   resolve({ "error": true, "Message": err});
//         // }else{
//         //     ResponseData.push(data.Location);
//         //     if(ResponseData.length == file.length){
//         //       resolve({  url: ResponseData});
//         //     }
//         //   }
//         if (err) {
//           console.log(err);
//           reject(err);
//         }
//         else {
//           resolve({
  
//             url: `https://ngrvideo.s3.ap-south-1.amazonaws.com/${fileName}`
//           });
//         }
//        });
//      });
//    });
// })

exports.uploadFileTos3 = ( (directoryPath, image)=>{
  return new Promise(async (resolve, reject) => {
      let s3bucket = new aws.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
         //region: process.env.AWS_REGION
        });
        const file = await Jimp.read(Buffer.from(image.buffer, 'base64'))
        .then(async image => {
          return image.getBufferAsync(Jimp.AUTO);
        })
      //const file = readChunk.sync(image.buffer, 0, 4100);
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: image.originalname,
          Body: file,
          ContentType: image.mimetype,
          ACL: 'public-read'
        };
     // const s3 = new aws.S3();
      console.log("File", image);
      let originalFileName = image.originalname;
      let splitedFileName = originalFileName.split('.')
      fileName = new Date().getTime().toString()+'.'+splitedFileName[splitedFileName.length-1];
       console.log("fileName",fileName)
      //const fileType = req.query['file-type'];
      const s3Params = {
        Bucket: 'vanamimage',
        Key: fileName,
        Body: file,
        Expires: 60,
        ContentType: image.mimetype,
        ACL: 'public-read'
      };
      console.log("param", params)
      s3bucket.upload(s3Params,  (err, data) => {
          if(err){
            console.log(err);
            //return res.end();
            reject(err);
          }
          else{
              resolve({
          
                  url: `https://vanamimage.s3.us-east-2.amazonaws.com/${fileName}`
              });
          }
    
        });
      
})
})

exports.uploadVideoTos3 = ((directoryPath, video,req) => {
  return new Promise(async (resolve, reject) => {
    let s3bucket = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    var ResponseData = [];
    console.log("video",video)

 
  const file = video;
 
     file.map((item) => {
      const fileName = item.originalname;
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: item.originalname,
        Body: item.buffer,
        ACL: 'public-read'
  };
s3bucket.upload(params, function (err, data) {
        if (err) {
          resolve({ "error": true, "Message": err});
        }else{
            ResponseData.push(data);
            if(ResponseData.length == file.length){
              resolve({  url: ResponseData});
            }
          }
       });
     });
   });
})

uploadFileToBlob = async (directoryPath, file) => {

    return new Promise((resolve, reject) => {


        const blobName = getBlobName(file.originalname);
        const stream = getStream(file.buffer);
        const streamLength = file.buffer.length;
        console.log("streamLength", streamLength);

        const blobService = azure.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey);

        blobService.createBlockBlobFromStream(azureStorageConfig.containerName, `${directoryPath}/${blobName}`, stream, streamLength, err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    filename: blobName,
                    originalname: file.originalname,
                    size: streamLength,
                    path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
                    url: `${azureStorageConfig.blobURL}${azureStorageConfig.containerName}/${directoryPath}/${blobName}`
                });
            }
        });

    });

};


const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};


// exports.uploadVideoInfo = (req, res) => {
//     console.log("--------uploadVideoDetails" + req.name);

//     //let form = new formidable.IncomingForm();
//     //form.keepExtensions = true;
//     console.log("--------222222");
//     let video = new Videoupload(req.body)
//     video.user = req.body.userId
//     console.log("--------3333333");

//     video.save((err, result) => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(result);
//     });
// };

// exports.findAllmedia = (req, res) => {
//     Videoupload.find()
//         .populate('user', '_id name profileImageUrl showAdd')
//         .populate('likes.likeBy', '_id name profileImageUrl')
//         .populate('comments.postedBy', '_id name profileImageUrl')
//         .then(videoList => {
//             var data = { "data": videoList }
//             res.send(data);
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving notes."
//             });
//         });
// };

// exports.like = (req, res) => {
//     Videoupload.findByIdAndUpdate(req.body.mediaId, { $push: { likes: { likeBy: req.body.userId, text: req.body.likeContent } } }, { new: true }).exec(
//         async (err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             } else {
//                 const receiver = await User.findOne({ _id: result.user._id });
//                 const sender = await User.findOne({ _id: req.body.userId });
//                 console.log("api invoked");
//                 var message = {
//                     app_id: "73d3f8d8-d268-498b-b1eb-43db090eeaab",
//                     contents: { "en": `${sender.name} likes your post!` },
//                     include_player_ids: [receiver.playerId] //'deb66713-0913-461a-a330-a67edb5fafb4'
//                 };
//                 sendNotification(message, res, result);

//                 //res.json(result);
//             }
//         }
//     );
// };

// // exports.unlike = (req, res) => {
// //     Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
// //         (err, result) => {
// //             if (err) {
// //                 return res.status(400).json({
// //                     error: err
// //                 });
// //             } else {
// //                 res.json(result);
// //             }
// //         }
// //     );
// // };

// exports.comment = (req, res) => {
//     let comment = {
//         text: req.body.text,
//         postedBy: req.body.postedBy,
//     };
//     //comment.postedBy = req.body.userId;

//     Videoupload.findByIdAndUpdate(req.body.mediaId, { $push: { comments: comment } }, { new: true })
//         //.populate('comments.postedBy', '_id name')
//         .populate('comments.postedBy', '_id name profileImageUrl')
//         .exec(async (err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             } else {
//                 const receiver = await User.findOne({ _id: result.user._id });
//                 const sender = await User.findOne({ _id: req.body.postedBy });
//                 console.log("api invoked");
//                 var message = {
//                     app_id: "73d3f8d8-d268-498b-b1eb-43db090eeaab",
//                     contents: { "en": `${sender.name} commented on your post!` },
//                     include_player_ids: [receiver.playerId] //'deb66713-0913-461a-a330-a67edb5fafb4'
//                 };
//                 sendNotification(message, res, result);
//             }
//         });
// };

// exports.uncomment = (req, res) => {
//     let comment = req.body.comment;

//     Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
//         .populate('comments.postedBy', '_id name')
//         .populate('postedBy', '_id name')
//         .exec((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             } else {
//                 res.json(result);
//             }
//         });
// };




