const UserModel = require('../models/users.model');
const crypto = require('crypto');
const config = require('../../common/config/env.config');
const accountSid = config.twilioSmsAPI.accountSid;
const authToken = config.twilioSmsAPI.authToken;
var merge = require('deepmerge');

const client = require('twilio')(accountSid, authToken);

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

exports.sendOtp = (req, res) => {
  let Otp = generateOTP();
  userData = Object.assign(req.body, { otp: Otp });
  let responseObj = {};

  UserModel.createUser(userData)
    // .then(result => {
    //   responseObj = result;
    //   // enable OTP
    //   return client.messages.create({
    //     body:
    //       result.otp + ' is your Orpay OTP. Enter this number and you are set!',
    //     from: '+15123593913',
    //     to: '+91' + result.mobileNumber,
    //   });
    // })
    .then(message => {
      //   res.status(200).send(responseObj);
      delete message._id;
      delete message.__v;
      res.status(200).send(message);
    })
    .catch(err => {
      res.status(409).send(err);
    });
};

exports.confirmOtp = (req, res) => {
  UserModel.confirmOtp(req.body)
    .then(result => {
      res.status(200).send('Received mobile number');
    })
    .catch(err => {
      res.status(409).send(err);
    });
};

exports.setup = (req, res) => {
  res.status(200).send('Received mobile number');
};

exports.insert = (req, res) => {
  let salt = crypto.randomBytes(16).toString('base64');
  let hash = crypto
    .createHmac('sha512', salt)
    .update(req.body.password)
    .digest('base64');
  req.body.password = salt + '$' + hash;
  req.body.permissionLevel = 1;

  UserModel.createUser(req.body).then(
    result => {
      res.status(201).send(result);
    },
    err => {
      res.status(409).send(err);
    }
  );
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  UserModel.list(limit, page).then(result => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  UserModel.findById(req.params.userId).then(result => {
    res.status(200).send(result);
  });
};
exports.patchById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto
      .createHmac('sha512', salt)
      .update(req.body.password)
      .digest('base64');
    req.body.password = salt + '$' + hash;
  }

  UserModel.patchUser(req.params.userId, req.body).then(result => {
    res.status(204).send({});
  });
};

exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId).then(result => {
    res.status(204).send({});
  });
};
