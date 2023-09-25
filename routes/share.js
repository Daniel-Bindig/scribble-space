const express = require('express');
const crypto = require('crypto');
const Share = require('../models/share.js');
const Entry = require('../models/entry.js');
const User = require('../models/user.js');
const router = express.Router();

// Share an entry
router.post('/', async (req, res) => {
  // Check if entry exists and user owns it
  const entry = await Entry.findOne({
    where: {
      id: req.body.entryId,
      userId: req.user.id
    }
  });
  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }
  
  // share-to user ID of 0 means share to unauthenticated users
  if (req.body.shareToUserId === 0) {
    // Create a new share entry
    const share = await Share.create({
      entryId: req.body.entryId,
      sharedUserId: 0,
      accessKey: crypto.randomBytes(32).toString('hex')
    });
    return res.json(share);
  }

  // Check if user exists
  const user = await User.findOne({
    where: {
      id: req.body.shareToUserId
    }
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create a new share entry
  const share = await Share.create({
    entryId: req.body.entryId,
    sharedUserId: req.body.shareToUserId
  });
  res.json(share);
});


// Get a shared entry
router.get('/:accessKey', async (req, res) => {
  const share = await Share.findOne({
    where: {
      accessKey: req.params.accessKey
    },
    include: [
      {
        model: Entry,
        attributes: ['id', 'title', 'content', 'tags', 'entryDate', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'username']
          }
        ]
      }
    ]
  });
  if (!share) {
    return res.status(404).json({ message: "Share not found" });
  }
  res.json(share);
});

module.exports = router;