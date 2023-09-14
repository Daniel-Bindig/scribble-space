const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');  // For password hashing
const User = require('../models/user');
const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    try {
      // Extract user details from request body
      const { username, email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create the new user
      const newUser = await User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
  
      // Optionally, log the user in (set a session or generate a token)
      
      return res.status(201).json({ message: 'User created successfully!', user: newUser });
  
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'Server error during registration.' });
    }
  });

// Login Route
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/dashboard',
}));

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
