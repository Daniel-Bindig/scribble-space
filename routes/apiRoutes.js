const express = require('express');
const router = express.Router();
const Task = require('../models/Task');  // Import your Sequelize Task model

// GET route to fetch all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching tasks');
  }
});

// GET route to fetch a single task by ID
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching task');
  }
});

// POST route to create a new task
router.post('/tasks', async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating task');
  }
});

// PUT route to update a task by ID
router.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.update(req.body, {
      where: { id: req.params.id }
    });
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating task');
  }
});

// DELETE route to delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.destroy({
      where: { id: req.params.id }
    });
    if (deletedTask) {
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).send('Task not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting task');
  }
});

module.exports = router;
