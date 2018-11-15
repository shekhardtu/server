UserModel = require('../../users/models/users.model');
const validator = require('validator');

exports.hasValidMobileNumber = (req, res, next) => {
  let errors = [];
  console.log(1);
  if (req.body) {
    const mobileNumber = req.body.mobileNumber;

    if (!mobileNumber) {
      errors.push('Missing mobile number');
    } else if (!validator.isMobilePhone(mobileNumber)) {
      errors.push('Incorrect mobile number format');
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(',') });
    } else {
      return next();
    }
  }
};
exports.hasValidOtpDigits = (req, res, next) => {
  let errors = [];

  if (req.body) {
    const mobileNumber = req.body.mobileNumber;

    if (!mobileNumber) {
      errors.push('Missing mobile number');
    } else if (!validator.isMobilePhone(mobileNumber)) {
      errors.push('Incorrect mobile number format');
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(',') });
    } else {
      return next();
    }
  }
};

exports.hasValidOtpDigits = (req, res, next) => {
  let errors = [];
  if (req.body) {
    let otp = req.body.otp;

    if (!otp) {
      errors.push('Missing OTP field');
    } else if (otp.toString().length != 4) {
      errors.push('OTP field should contain exactly four character');
    } else if (!validator.isNumeric(otp, { no_symbols: true })) {
      errors.push('OTP field should only contain numeric character');
    }

    if (!validator.isMongoId(req.body.id)) {
      errors.push('There is something wrong, please try again');
    }

    console.log(errors);
    if (errors.length) {
      return res.status(400).send({ errors: errors.join(',') });
    } else {
      return next();
    }
  }
};
