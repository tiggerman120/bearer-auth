'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const todo = mongoose.Schema({
  text: { type: String, required: true },
  assignee: { type: String },
  complete: { type: Boolean, default:false },
  difficulty: { type: Number, default: 1 },
});

module.exports = mongoose.model('todo', todo);
