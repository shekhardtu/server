const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
  let errors = [];

  if (req.body) {
    if (!req.body.email) {
      errors.push('Missing email field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(',') });
    } else {
      return next();
    }
  } else {
    return res
      .status(400)
      .send({ errors: 'Missing email and password fields' });
  }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModel.findByEmail(req.body.email).then(user => {
    if (!user) {
      res.status(404).send({ message: 'Please check your email or password' });
    } else {
      let passwordFields = user.password.split('$');
      let salt = passwordFields[0];
      let hash = crypto
        .createHmac('sha512', salt)
        .update(req.body.password)
        .digest('base64');
      if (hash === passwordFields[1]) {
        req.body = {
          userId: user._id,
          email: user.email,
          permissionLevel: user.permissionLevel,
          provider: 'email',
          name: user.firstName + ' ' + user.lastName,
        };
        return next();
      } else {
        return res.status(400).send({ errors: ['Invalid e-mail or password'] });
      }
    }
  });
};
