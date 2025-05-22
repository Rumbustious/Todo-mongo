const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

router.post('/', async (req, res) => {
  const todo = new Todo(req.body);
  const saved = await todo.save();
  res.json(saved);
});

router.put('/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Todo.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

module.exports = router;
