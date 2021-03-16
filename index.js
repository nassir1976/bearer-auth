'use strict';

// Start up DB Server
require('dotenv').config()
const mongoose = require('mongoose');
const server = require('./src/server.js');
// ==========connecting to our DB===========

const PORT = process.env.PORT || 3333;
const MONGODB_URI = 'mongodb://localhost:27017/api-server'; // api-server is the DB name
const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,}; // always pass in these options

mongoose.connect(MONGODB_URI, options);

server.start(PORT);


// require('./src/server.js')
// const options = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// };
// mongoose.connect(process.env.MONGODB_URI, options);

// // Start the web server



// mongoose.connect('mongodb://localhost:27017/auth-server-demo', mongooseOptions)
//   .then(() => {
//     app.listen(PORT, () => console.log(`server up: ${PORT}`));
//   })
//   .catch(e => console.error(e));