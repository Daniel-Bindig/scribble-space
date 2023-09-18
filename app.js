// Required modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');

// Initialize dotenv 
dotenv.config();

// Database setup
const { sequelize } = require('./database');

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

// Initialize Passport and restore authentication state from the session
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

// Export app 
module.exports = app;
