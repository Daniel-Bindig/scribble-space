const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');  

const router = express.Router();

// Registration Route
router.post('/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });

      res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Login Route
router.post('/login', 
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), 
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
