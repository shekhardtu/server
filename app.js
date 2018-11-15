const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const AuthorizationRouter = require('./app/authorization/routes.config');
const UsersRouter = require('./app/users/routes.config');

const API_PORT = 3600;
const app = express();
const router = express.Router();
const routes = require('./app/index.routes');

require('./index.models');

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/', function(req, res) {
  res.send('Hello World');
});

// append /api for our http requests
app.use('/api', router);
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);

// launch our backend into a port
app.listen(API_PORT, () => {
  console.log(`Server is LISTENING ON PORT ${API_PORT}`);
  console.log(
    `You can now view orpay api in the browser. \nLocal: http://localhost:${API_PORT}/ \n On Your Network:  http://192.168.31.154:${API_PORT}/`
  );
});
