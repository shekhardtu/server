const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');
const config = require('../../common/config/env.config');
const accountSid = config.twilioSmsAPI.accountSid;
const authToken = config.twilioSmsAPI.authToken;

const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
  jwt = require('jsonwebtoken');

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

exports.sendOptIfMobileNumberMatch = (req, res, next) => {
  //
  UserModel.generateOtpForExistingMobileNumber(req.body.mobileNumber)
    .then(result => {
      // Twilio promise API
      //   client.messages
      //     .create({
      //       body:
      //         result.otp +
      //         ' is your Orpay OTP. Enter this number and you are set!',
      //       from: '+15123593913',
      //       to: result.mobileNumber,
      //     })
      //     .then(response => {
      //       response.id = result.id;
      //       res.status(200).send(response);
      //     })
      //     .catch(err => {
      //       res.status(409).send(err);
      //     });
      res.status(200).send(result);
    })
    .catch(err => {
      next();
    });
};

exports.sendOptIfMobileNumberNotMatch = (req, res) => {
  let Otp = generateOTP();
  userData = Object.assign(req.body, { otp: Otp });

  UserModel.createUser(userData)
    .then(result => {
      // Twilio promise API
      // client.messages
      //   .create({
      //     body:
      //       result.otp +
      //       ' is your Orpay OTP. Enter this number and you are set!',
      //     from: '+15123593913',
      //     to: result.mobileNumber,
      //   })
      //   .then(result => {
      //     res.status(200).send(result);
      //   })
      //   .catch(err => {
      //     // FIX: Status code when SMS service not working
      //     res.status(409).send(err);
      //   });
      res.status(200).send(result);
    })
    .catch(err => {
      // FIX: Status code when database insert not working
      res.status(409).send(err);
    });
};

exports.confirmOtp = (req, res, next) => {
  UserModel.confirmOtp(req.body)
    .then(user => {
      console.log(user);
      req.body = {
        userId: user.id,
        mobileNumber: user.mobileNumber,
      };
      return next();
    })
    .catch(err => {
      res.status(409).send({ err, message: 'Please re-generate your OTP' });
    });
};

exports.loginWithOtp = (req, res) => {
  try {
    let refreshId = req.body.userId + jwtSecret;
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto
      .createHmac('sha512', salt)
      .update(refreshId)
      .digest('base64');
    req.body.refreshKey = salt;

    let token = jwt.sign(req.body, jwtSecret);
    let b = new Buffer(hash);
    let refresh_token = b.toString('base64');
    res.status(201).send({
      id: req.body.userId,
      auth: { accessToken: token, refreshToken: refresh_token },
    });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

exports.setup = (req, res) => {
  res.status(200).send('Received mobile number');
};
