const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user'); 
const router = express.Router();

// Number of salt rounds
const saltRounds = 10;

// Signup Route - Display Signup Form
router.get('/signup', (req, res) => {
  res.render('signup'); // Renders the "signup.handlebars" template
});

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password using bcrypt
  const hash = await bcrypt.hash(password, saltRounds);
  
  try {
    const newUser = await User.create({
      username,
      email,
      passwordHash: hash
    });
    res.redirect('/auth/login');  // Redirect to login page
  }  catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// GET: Fetch User by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json({ message: 'User found', user: user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});

// Login Route - Display Login Form
router.get('/login', (req, res) => {
  res.render('login'); // Renders the "login.handlebars" template
});


// Login Route
router.post('/login', 
  passport.authenticate('local', {
    failureRedirect: '/auth/login-failure',
    successRedirect: '/auth/login-success'
  })
);

// GET: Fetch details of currently logged-in user
router.get('/user/details', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


router.get('/login-success', (req, res) => {
  res.send('Login successful');
});

router.get('/login-failure', (req, res) => {
  res.send('Login failed');
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ status: 'Logged in' });
  } else {
    res.status(200).json({ status: 'Logged out' });
  }
});


module.exports = router;
