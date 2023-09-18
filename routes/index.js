const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.username) {
    return next();
  }
  return res.status(401).json({ message: "Unauthenticated" });
};

router.use(isAuthenticated);

// Routes
const entry = require('./entry');
//const reminder = require('./reminder');
// Add any others here

router.use('/entry', entry);
//router.use('/reminder', reminder);

module.exports = router;