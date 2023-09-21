const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');  
const saltRounds = 10;  // Number of sa


router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();  
    res.status(200).json({ users });
  } catch (error) {
    console.error("There was an error fetching users", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Create a new user
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hash = await bcrypt.hash(password, saltRounds);

  try {
    const newUser = await User.create({
      username,
      email,
      passwordHash: hash  
    });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password is part of the update, hash the new password
    if (password) {
      const hash = await bcrypt.hash(password, saltRounds);
      user.passwordHash = hash;
    }

    // Update other fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    
    res.status(200).json({ message: `User ${id} updated`, user: user });

  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
});



// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    
    res.status(200).json({ message: `User ${id} deleted` });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

router.get('/resource', (req, res) => {
  res.json({ message: 'Your GET response data here' });
});

module.exports = router;
