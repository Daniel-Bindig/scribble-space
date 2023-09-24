const express = require('express');
const Entry = require('../models/entry.js');
const router = express.Router();

// Get all entries
router.get('/', async (req, res) => {
  const entries = await Entry.findAll({
    where: {
      userId: req.user.id
    }
  });
  res.json(entries);
});

// Get all entries preview (without content)
router.get('/preview', async (req, res) => {
  console.log(req.user.id)
  const entries = await Entry.findAll({
    where: {
      userId: req.user.id
    },
    attributes: ['id', 'title', 'tags', 'createdAt', 'updatedAt', 'entryDate']
  });
  res.json(entries);
});

// Get entry by id
router.get('/:id', async (req, res) => {
  const entry = await Entry.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });
  res.json(entry);
});

// Create entry
router.post('/', async (req, res) => {
  const entry = await Entry.create({
    userId: req.user.id,
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    entryDate: req.body.entryDate
  });
  res.json(entry);
});

// Update entry
router.put('/:id', async (req, res) => {
  const entry = await Entry.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });
  entry.title = req.body.title;
  entry.content = req.body.content;
  entry.tags = req.body.tags;
  entry.entryDate = req.body.entryDate;
  await entry.save();
  res.json(entry);
});

// Delete entry
router.delete('/:id', async (req, res) => {
  const entry = await Entry.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id
    }
  });
  await entry.destroy();
  res.json({ message: "Deleted entry" });
});



module.exports = router;