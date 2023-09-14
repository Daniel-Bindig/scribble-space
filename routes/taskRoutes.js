const express = require('express');
const router = express.Router();
const { Task } = require('../models'); 

// GET route for retrieving all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving tasks' });
  }
});

// POST route for adding a new task
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = await Task.create({ title, description });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the task' });
  }
});

// DELETE route for deleting a task by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const taskToDelete = await Task.findOne({ where: { id: id } });

    if (taskToDelete) {
      await taskToDelete.destroy();
      res.status(200).json({ message: 'Task deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Task not found.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the task.' });
  }
});

module.exports = router;
