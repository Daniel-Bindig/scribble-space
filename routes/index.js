const express = require('express');

// Initialize Routers
const mainRouter = express.Router();
const unauthenticatedRouter = express.Router();
const authenticatedRouter = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.username) {
    return next();
  }
  return res.status(401).json({ message: "Unauthenticated" });
};

// Register Unauthenticated Routes
const share = require('./share');
unauthenticatedRouter.use('/share', share);

// Other static routes
unauthenticatedRouter.get('/attributions', (req, res) => {
  res.render('content/attributions');
});

// Register Authenticated Routes
authenticatedRouter.use(isAuthenticated); // Apply authentication middleware
const entry = require('./entry');
const reminder = require('./reminder');
// Add any other authenticated routes here
authenticatedRouter.use('/entry', entry);
authenticatedRouter.use('/reminder', reminder);

// Register Main Router
mainRouter.use('/', unauthenticatedRouter); // Unauthenticated routes
mainRouter.use('/', authenticatedRouter); // Authenticated routes

module.exports = mainRouter;
