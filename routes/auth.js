const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user'); 
const router = express.Router();

// Number of salt rounds
const saltRounds = 10;

// Signup Route - Display Signup Form
router.get('/signup', (req, res) => {
  res.render('content/signup');
});

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  console.log(`Received: username=${username}, email=${email}, password=${password}`);  // Debug log

  //add username length check here
  if (username.length < 4 || username.length > 32) {
    return res.status(400).json({ message: 'Username must be between 4 and 32 characters.' });
  }

  //check if user already exists return error if they do
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Add Password Length Check here
  if (password.length < 8 || password.length > 32) {
    return res.status(400).json({ message: 'Password must be between 8 and 32 characters.' });
  }

  // Hash the password using bcrypt
  const hash = await bcrypt.hash(password, saltRounds);
  
  try {
    const newUser = await User.create({
      username,
      email,
      passwordHash: hash
    });
    // Log in user after signup and redirect to dashboard
    req.logIn(newUser, function(err) {
      if (err) { 
        return next(err); 
      }
      return res.redirect('/');
    });
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
  res.render('content/login');
});

// Login route
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      return res.render('content/login', { message: 'Incorrect username or password' });
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// GET: Fetch details of currently logged-in user
router.get('/user/details', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
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
