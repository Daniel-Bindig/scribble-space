// Required modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');

// Initialize dotenv for environment variables
dotenv.config();

// Database setup
const { sequelize } = require('./models');

// Passport config
require('./config/passport-setup');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state from the session, if any
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/apiRoutes'));

// Test database connection and synchronize models
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Export app to use it in other files like server.js
module.exports = app;
