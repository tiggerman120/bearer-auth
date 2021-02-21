'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./auth/models/users.js');
const Todo = require('./auth/models/todo.js');
const basicAuth = require('./auth/middleware/basic.js')
const bearerAuth = require('./auth/middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    console.log(user)
    const userRecord = await user.save(req.body);
    console.log(userRecord)
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

authRouter.post('/todo', async (req, res, next) => {
  try {
    let todo = new Todo(req.body);
    console.log(todo)
    const todoRecord = await todo.save(req.body);
    console.log(todoRecord)
    const output = {
      user: todoRecord,
      token: todoRecord.token
    };
    res.status(201).json(output);
  } catch (e) { res.status(403).send(e.message);
    next()
  }
})

authRouter.get('/todo', async (req, res, next) => {
  const todo = await Todo.find({});
  const list = todo.map(item => (item));
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;