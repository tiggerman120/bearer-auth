'use strict';

// 3rd Party Resources
const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const mongoose = require('mongoose');
const Users = require('./src/models/user-model.js')
// our middleware
const basicAuth = require('./src/auth/basic-auth-middleware.js');

// Prepare the express app
const app = express();

// Process JSON input and put the data on req.body
app.use(express.json());

// Process FORM intput and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Create a mongoose model

//const Users = mongoose.model('users', usersSchema);
app.get('/', (req, res) => {
  res.status(200).json('hello world');
})
// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup usernmae=john password=foo
app.post('/signup', async (req, res) => {

  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = new Users(req.body);
    // pre-hook automatically hashes the password
    const record = await user.save(req.body);
    res.status(200).json(record);
  } catch (e) { res.status(403).send("Error Creating User"); }
});


// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
app.post('/signin', basicAuth, (req, res) => {

  res.status(200).send(req.user);

});

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => console.log('server up'));
  }
}