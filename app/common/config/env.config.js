module.exports = {
  port: 3600,
  appEndpoint: 'http://localhost:3600',
  apiEndpoint: 'http;//localhost:3600',
  jwt_secret: 'myS33!!creeeT',
  jwt_expiration_in_seconds: 36000,
  environment: 'dev',
  twilioSmsAPI: {
    accountSid: 'ACb418d3c7923141a81d58e61d9b64fa82',
    authToken: 'c2e66077c23af6c33e42e80af61cfa7f',
  },
  permissionLevels: {
    NORMAL_USER: 1,
    PAID_USER: 4,
    ADMIN: 2048,
  },
};
