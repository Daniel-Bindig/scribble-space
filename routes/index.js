const express = require('express');

// Initialize Routers
const mainRouter = express.Router();
const unauthenticatedRouter = express.Router();
const authenticatedRouter = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthenticated" });
};

// Register Unauthenticated Routes
const share = require('./share');
const auth = require('./auth');
const user = require('./user');
unauthenticatedRouter.use('/share', share);
unauthenticatedRouter.use('/auth', auth);
unauthenticatedRouter.use('/user', user);

// Other static routes
unauthenticatedRouter.get('/attributions', (req, res) => {res.render('content/attributions');});
unauthenticatedRouter.get('/about', (req, res) => {res.render('content/about');});
unauthenticatedRouter.get('/github', (req, res) => {res.redirect('https://github.com/Daniel-Bindig/scribble-space');});

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
