const express = require('express');
const Entry = require('../models/entry.js');
const router = express.Router();

// Get all entries
router.get('/', async (req, res) => {
  const entries = await Entry.findAll({
    where: {
      userId: req.session.userId
    }
  });
  res.json(entries);
});

// Get all entries preview (without content)
router.get('/preview', async (req, res) => {
  const entries = await Entry.findAll({
    where: {
      userId: req.session.userId
    },
    attributes: ['id', 'title', 'tags', 'createdAt', 'updatedAt']
  });
  res.json(entries);
});

// Get entry by id
router.get('/:id', async (req, res) => {
  const entry = await Entry.findOne({
    where: {
      id: req.params.id,
      userId: req.session.userId
    }
  });
  res.json(entry);
});

// Create entry
router.post('/', async (req, res) => {
  const entry = await Entry.create({
    userId: req.session.userId,
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags
  });
  res.json(entry);
});

// Update entry
router.put('/:id', async (req, res) => {
  const entry = await Entry.findOne({
    where: {
      id: req.params.id,
      userId: req.session.userId
    }
  });
  entry.title = req.body.title;
  entry.content = req.body.content;
  entry.tags = req.body.tags;
  await entry.save();
  res.json(entry);
});

// Delete entry
router.delete('/:id', async (req, res) => {
  const entry = await Entry.findOne({
    where: {
      id: req.params.id,
      userId: req.session.userId
    }
  });
  await entry.destroy();
  res.json({ message: "Deleted entry" });
});



module.exports = router;