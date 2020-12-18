'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./auth/models/users.js');
const basicAuth = require('./auth/middleware/basic.js')
const bearerAuth = require('./auth/middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) { res.status(403).send(e.message);
    next()
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;