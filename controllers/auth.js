const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const { sendEmail } = require('../helpers');
const { isBoolean } = require('lodash');
const axios = require('axios');
const TwoFactor = new(require('2factor'))('eec85aaf-8a1f-11eb-a9bc-0200cd936042')
//const SendOtp = require('sendotp');
//const sendOtp = new SendOtp('355621AtYK2v4Mq604071d5P1');

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    const numberExists = await User.findOne({ phone: req.body.phone });

    if (numberExists)
        return res.status(403).json({
            error: 'Already have an account on this Number!'
        });
    let isTermsConditionsApply = req.body.isTermsConditions;
    if (typeof(isTermsConditionsApply) === "boolean"){
        console.log("is a boolean")
        }
        else{
            return res.status(403).json({
                error: 'input boolean'
            });   
        }
     console.log(" a new user added", req.body);
    if (userExists)
        return res.status(403).json({
            error: 'Email is taken!'
        });
        if(isTermsConditionsApply === false){
            return res.status(403).json({
                message:"please accept the terms and conditions"
            })
        }
    const user = await new User(req.body);
  await user.save((err, result) => {
      
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({ message: 'Signup success! Please login.' });
    }
  );
   
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist. Please signup.'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match'
            });
        }
        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // retrun response with user and token to frontend client
        const { _id, name, email, role, profileImageUrl, coverImageUrl } = user;
        return res.json({ token, user: { _id, email, name, role, profileImageUrl, coverImageUrl } });
    });
};

exports.signout = (req, res) => {app.use(expressValidator());
    res.clearCookie('t');
    return res.json({ message: 'Signout success!' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    // userProperty: 'auth',
     algorithms: ['HS256'] 
});

exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: 'No request body' });
    if (!req.body.email) return res.status(400).json({ message: 'No Email in request body' });

    console.log('forgot password finding user with that email');
    const { email } = req.body;
    console.log('signin req.body', email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status('401').json({
                error: 'User with that email does not exist!'
            });

        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);

        // email data
        const emailData = {
            from: 'noreply@node-react.com',
            to: email,
            subject: 'Password Reset Instructions',
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
                }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
                }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

// exports.resetPassword = (req, res) => {
//     const { resetPasswordLink, newPassword } = req.body;

//     User.findOne({ resetPasswordLink }, (err, user) => {
//         // if err or no user
//         if (err || !user)
//             return res.status('401').json({
//                 error: 'Invalid Link!'
//             });

//         const updatedFields = {
//             password: newPassword,
//             resetPasswordLink: ''
//         };

//         user = _.extend(user, updatedFields);
//         user.updated = Date.now();

//         user.save((err, result) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: err
//                 });
//             }
//             res.json({
//                 message: `Great! Now you can login with your new password.`
//             });
//         });
//     });
// };

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.socialLogin = async (req, res) => {
    const idToken = req.body.tokenId;
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.REACT_APP_GOOGLE_CLIENT_ID });
    // console.log('ticket', ticket);
    const { email_verified, email, name, picture, sub: googleid } = ticket.getPayload();

    if (email_verified) {
        console.log(`email_verified > ${email_verified}`);

        const newUser = { email, name, password: googleid };
        // try signup by finding user with req.email
        let user = User.findOne({ email }, (err, user) => {
            if (err || !user) {
                // create a new user and login
                user = new User(newUser);
                req.profile = user;
                user.save();
                // generate a token with user id and secret
                const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);
                res.cookie('t', token, { expire: new Date() + 9999 });
                // return response with user and token to frontend client
                const { _id, name, email } = user;
                return res.json({ token, user: { _id, name, email } });
            } else {
                // update existing user with new social info and login
                req.profile = user;
                user = _.extend(user, newUser);
                user.updated = Date.now();
                user.save();
                // generate a token with user id and secret
                const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);
                res.cookie('t', token, { expire: new Date() + 9999 });
                // return response with user and token to frontend client
                const { _id, name, email } = user;
                return res.json({ token, user: { _id, name, email } });
            }
        });
    }
};

// exports.socialLogin = (req, res) => {
//     console.log('social login req.body', req.body);

// // try signup by finding user with req.email
// let user = User.findOne({ email: req.body.email }, (err, user) => {
//     if (err || !user) {
//         // create a new user and login
//         user = new User(req.body);
//         req.profile = user;
//         user.save();
//         // generate a token with user id and secret
//         const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);
//         res.cookie('t', token, { expire: new Date() + 9999 });
//         // return response with user and token to frontend client
//         const { _id, name, email } = user;
//         return res.json({ token, user: { _id, name, email } });
//     } else {
//         // update existing user with new social info and login
//         req.profile = user;
//         user = _.extend(user, req.body);
//         user.updated = Date.now();
//         user.save();
//         // generate a token with user id and secret
//         const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);
//         res.cookie('t', token, { expire: new Date() + 9999 });
//         // return response with user and token to frontend client
//         const { _id, name, email } = user;
//         return res.json({ token, user: { _id, name, email } });
//     }
// });
// };
exports.sendOtp = async (req,res)=>{
    const { phone } = req.body;
    User.findOne({ phone }, (err, user) => {
        // if err or no user
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that Number does not exist. Please signup.'
            });
        }
        axios.get(`https://2factor.in/API/V1/eec85aaf-8a1f-11eb-a9bc-0200cd936042/SMS/+91${req.body.phone}/AUTOGEN`)
        .then(response => {
    
            console.log("response",response.data.Details)
    res.status(200).json({success: 'otp sent successfully', sessionID:response.data.Details})
        })
        .catch(error => {
            res.status(500).json({error: error})
          console.log(error);
        });

    });
     
  }
exports.verifyOtp = (req,res)=>{
    axios.get(`https://2factor.in/API/V1/eec85aaf-8a1f-11eb-a9bc-0200cd936042/SMS/VERIFY/${req.body.sessionID}/${req.body.otp}`)
    .then(response => {
res.status(200).json({success: 'otp verify successfully'})
    })
    .catch(error => {
        res.status(500).json({error: error})
      console.log(error);
    });

  }
exports.resetPassword=(req,res)=>{
    const { newPassword , number} = req.body;

    User.findOne({ phone:number }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status('401').json({
               message:'number does not exists'
            });

        
            user.password= newPassword;
            user.updated=Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: 'Now you can login with your new password.'
            });
        });
    });


  }