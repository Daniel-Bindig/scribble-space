const express = require('express');
const Reminder = require('../models/reminder.js');
const Entry = require('../models/entry.js');
const User = require('../models/user.js');
const router = express.Router();

// Get all reminders
router.get('/', async (req, res) => {
  const reminders = await Reminder.findAll({
    include: [
      {
        model: Entry,
        attributes: [],
        where: { userId: req.user.id },
      },
    ]
  });
  res.json(reminders);
});

// Get reminder by ID
router.get('/:id', async (req, res) => {
  const reminder = await Reminder.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Entry,
        attributes: [],
        where: { userId: req.user.id },
      },
    ]
  });
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  res.json(reminder);
});

// Get reminders by entry ID
router.get('/entry/:id', async (req, res) => {
  const reminder = await Reminder.findAll({
    where: {
      entryId: req.params.id
    },
    include: [
      {
        model: Entry,
        attributes: [],
        where: { userId: req.user.id},
      },
    ]
  });
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  res.json(reminder);
});

// Create reminder
router.post('/', async (req, res) => {
  const entry = await Entry.findOne({
    where: {
      id: req.body.entryId,
      userId: req.user.id
    }
  });
  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }
  const reminder = await Reminder.create({
    entryId: req.body.entryId,
    reminderTime: req.body.reminderTime
  });
  res.json(reminder);
});

// Update reminder
router.put('/:id', async (req, res) => {
  const reminder = await Reminder.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Entry,
        attributes: [],
        where: { userId: req.user.id },
      },
    ]
  });
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  reminder.reminderTime = req.body.reminderTime;
  reminder.isCompleted = req.body.isCompleted;
  await reminder.save();
  res.json(reminder);
});

// Delete reminder
router.delete('/:id', async (req, res) => {
  const reminder = await Reminder.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Entry,
        attributes: [],
        where: { userId: req.user.id },
      },
    ]
  });
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  await reminder.destroy();
  res.json({ message: "Deleted reminder" });
});

module.exports = router;