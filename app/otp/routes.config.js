const OtpController = require('./controllers/otp.controller');

const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const verifyMiddlewares = require('./middlewares/verify.otp.middleware');

exports.routesConfig = function(app) {
  app.post('/otp', [
    verifyMiddlewares.hasValidMobileNumber,
    OtpController.sendOptIfMobileNumberMatch,
    OtpController.sendOptIfMobileNumberNotMatch,
  ]);

  app.post('/otp/confirm', [
    verifyMiddlewares.hasValidOtpDigits,
    OtpController.confirmOtp,
    OtpController.loginWithOtp,
  ]);
};
