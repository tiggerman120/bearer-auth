'use strict';

require('dotenv').config();

// start up DB server
const mongoose = require('mongoose');
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGODB_URI, options)

// start up the web server
require('./app').start(process.env.PORT);