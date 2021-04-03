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

exports.createPage = async (req, res) => {
   if(!req.body.pageName || !req.body.pageDescription || !req.body.pageTitle){
    return res.status(400).json({
        error: 'please enter valid data'
    });
   }
    let userRequest = {...req.body,type:"page",firstName:"testof",lastName:"testinga",email:"testaaaeeee8@gmail.com",phone:"8777477444",password:"Test@1442",isTermsConditions:true}
    const user = await new User(userRequest);
  await user.save((err, result) => {
      
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({ message: 'page created succesfully.' });
    }
  );
   
};

exports.allPages = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        console.log("filtered users",users.filter(x=>x.type&&x.type==='page'))
        res.json(users.filter(x=>x.type&&x.type==='page'));
    })
        .select('_id pageName pageDescription type pageTitle');
};
exports.pageById = (req, res) => {
    console.log("param ",req.params.pageID)
    User.findById({_id:req.params.pageID},(err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
    
        res.json(users);
    })
        .select('_id pageName pageDescription type pageTitle createdAt updatedAt following followers profileImageUrl coverImageUrl ');
};