'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./auth/models/users.js');
const Todo = require('./auth/models/todo.js');
const basicAuth = require('./auth/middleware/basic.js')
const bearerAuth = require('./auth/middleware/bearer.js');
const { findOneAndUpdate } = require('./auth/models/users.js');

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
  } catch (e) {
    res.status(403).send(e.message);
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
  } catch (e) {
    res.status(403).send(e.message);
    next()
  }
})

authRouter.get('/todo/:id', async (req, res, next) => {
  const todo = await Todo.findOne({ id: req.params._id }).exec()
  res.status(200).json(todo)
})


authRouter.get('/todo', async (req, res, next) => {

  const todo = await Todo.find({});
  const list = todo.map(item => (item));
  res.status(200).json(list);
});


authRouter.put('/todo/:_id', async (req, res, next) => {
  try {
    const updatedItem = await Todo.findByIdAndUpdate(req.params._id, req.body, { new: true, useFindAndModify: false })
    console.log(updatedItem)
    res.status(200).json(updatedItem)
    if (!updateditem) {
      return res.status(404).send(`no item to update`)
    }
    res.status(201).send(updatedItem)
  }
  catch {
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  }
})

authRouter.delete('/todo/:_id', async (req, res) => {
  try {
    const result = await Todo.findOneAndDelete({ _id: req.params._id })
    console.log(result)
    res.status(200).json({
      message: 'Deleted',
      result: result,
    })
  }
  catch {
    (error) => {
      res.status(400).json({
        error: error
      })
    }
  }
})

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;