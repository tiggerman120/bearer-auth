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

authRouter.get('/todo/:id', async (req, res, next) => {
  const id = req.params._id;
  console.log(id)
  const todo = await Todo.findOne({_id: id}).exec()
  res.status(200).json(todo)
})


authRouter.get('/todo', async (req, res, next) => {
  console.log(req)
  const todo = await Todo.find({});
  const list = todo.map(item => (item));
  res.status(200).json(list);
});


authRouter.put('/todo/:id', async (req, res, next) => {
  const id = req.params.id
  console.log(id)
})

authRouter.delete('/todo/:_id', (req, res) => {
  Todo.deleteOne({ _id: req.params._id }),then(
    () => {
      res.status(200).json({
        message: 'Deleted'
      })
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error:error
      })
    }
  )
})

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;