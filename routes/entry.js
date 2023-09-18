const express = require('express');
const Entry = require('../models/entry.js');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.username) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

router.use(isAuthenticated);
