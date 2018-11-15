const mongoose = require('mongoose');

// this is our MongoDB database
// const dbRoute = 'mongodb://hari:Hari#124@ds131973.mlab.com:31973/harishekhar';
const dbRoute = 'mongodb://localhost/orpay';

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true, useCreateIndex: true }
);

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
